import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    open: 0,
    pending: 0,
    resolved: 0,
    total: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [errorSummary, setErrorSummary] = useState("");
  const [errorTickets, setErrorTickets] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/api/dashboard/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
        setErrorSummary("Could not load dashboard counts.");
      } finally {
        setLoadingSummary(false);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await api.get("/api/tickets");
        
        const latestFive = res.data.slice(-5).reverse();
        setRecentTickets(latestFive);
      } catch (err) {
        console.error("Failed to load recent tickets:", err);
        setErrorTickets("Could not load recent tickets.");
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchSummary();
    fetchTickets();
  }, []);

  const { open, pending, resolved } = summary;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="page-subtitle">Overview of your support activity.</p>

      {/* KPI cards */}
      <section className="dashboard-kpis">
        <div className="kpi-card">
          <span className="kpi-label">Open Tickets</span>
          <span className="kpi-value">{loadingSummary ? "-" : open}</span>
          <span className="kpi-subtext">Active conversations</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Pending</span>
          <span className="kpi-value">{loadingSummary ? "-" : pending}</span>
          <span className="kpi-subtext">Waiting on agent</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Resolved</span>
          <span className="kpi-value">{loadingSummary ? "-" : resolved}</span>
          <span className="kpi-subtext">Today</span>
        </div>
      </section>

      {/* Recent tickets + SLA overview */}
      <section className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Tickets</h3>
            <button className="link-button">View all</button>
          </div>

          {loadingTickets ? (
            <p className="muted">Loading recent tickets...</p>
          ) : errorTickets ? (
            <p className="muted">{errorTickets}</p>
          ) : recentTickets.length === 0 ? (
            <p className="muted">No tickets found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.customer}</td>
                    <td>{ticket.subject}</td>
                    <td>
                      <span
                        className={`badge badge-${ticket.status.toLowerCase()}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>{ticket.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3>SLA Overview</h3>
          </div>
          {errorSummary ? (
            <p className="muted">{errorSummary}</p>
          ) : (
            <p className="muted">
              92% of tickets were answered within 4 hours in the last 7 days.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}