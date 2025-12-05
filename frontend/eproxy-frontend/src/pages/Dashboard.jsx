import React from "react";
import { tickets } from "../data/tickets.js";

export default function Dashboard() {
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const pendingCount = tickets.filter((t) => t.status === "Pending").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="page-subtitle">Overview of your support activity.</p>

      <section className="dashboard-kpis">
        <div className="kpi-card">
          <span className="kpi-label">Open Tickets</span>
          <span className="kpi-value">{openCount}</span>
          <span className="kpi-subtext">Active conversations</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Pending</span>
          <span className="kpi-value">{pendingCount}</span>
          <span className="kpi-subtext">Waiting on agent</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Resolved</span>
          <span className="kpi-value">{resolvedCount}</span>
          <span className="kpi-subtext">Today</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Tickets</h3>
            <button className="link-button">View all</button>
          </div>

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
              {tickets.slice(0, 5).map((ticket) => (
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
        </div>

        <div className="card">
          <div className="card-header">
            <h3>SLA Overview</h3>
          </div>
          <p className="muted">
            92% of tickets were answered within 4 hours in the last 7 days.
          </p>
        </div>
      </section>
    </div>
  );
}
