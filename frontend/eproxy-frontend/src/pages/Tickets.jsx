import React from "react";
import { tickets } from "../data/tickets.js";

export default function Tickets() {
  return (
    <div className="tickets-page">
      <h2>Tickets</h2>
      <p className="page-subtitle">
        Browse and manage all customer requests.
      </p>

      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search by subject or customer..."
          type="text"
        />
        <button className="primary-button">New Ticket</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.customer}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.priority}</td>
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
    </div>
  );
}
