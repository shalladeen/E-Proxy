import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";

export default function Tickets({ searchTerm, onSearchChange }) {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customer: "",
    subject: "",
    priority: "Medium",
    status: "Open",
  });

  // -------------------- load tickets --------------------
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/api/tickets");
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
        setError("Could not load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

 
  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      
      return d.toISOString().split("T")[0];
    }
    
    return String(value).split("T")[0];
  };

  // search + status filter
  const filteredTickets = tickets.filter((ticket) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        ticket.id.toString().toLowerCase().includes(q) ||
        ticket.customer.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.status.toLowerCase().includes(q) ||
        ticket.priority.toLowerCase().includes(q);

      if (!matchesSearch) return false;
    }

    if (statusFilter !== "all") {
      return ticket.status.toLowerCase() === statusFilter;
    }

    return true;
  });

  // -------------------- ticket modal --------------------
  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTicket({
      customer: "",
      subject: "",
      priority: "Medium",
      status: "Open",
    });
  };

  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!newTicket.customer.trim() || !newTicket.subject.trim()) {
      alert("Customer and subject are required.");
      return;
    }

    try {
      const res = await api.post("/api/tickets", newTicket);
      setTickets((prev) => [res.data, ...prev]); 
      closeModal();
    } catch (err) {
      console.error("Failed to create ticket:", err);
      alert("Could not create ticket. Please try again.");
    }
  };

  // -------------------- ticket status change --------------------
  const handleStatusChange = async (ticket, newStatus) => {
    const ticketId = ticket.internalId; 
    const originalStatus = ticket.status;

    
    const locallyUpdated = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) => (t.internalId === ticketId ? locallyUpdated : t))
    );

    try {
      const res = await api.put(`/api/tickets/${ticketId}/status`, {
        status: newStatus,
      });

      // syncs with backend response
      const saved = res.data;
      setTickets((prev) =>
        prev.map((t) => (t.internalId === ticketId ? saved : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);

      // revert UI
      setTickets((prev) =>
        prev.map((t) =>
          t.internalId === ticketId ? { ...t, status: originalStatus } : t
        )
      );
      alert("Could not update ticket status. Reverting.");
    }
  };

  // -------------------- render --------------------
  return (
    <div className="tickets-page">
      <h2>Tickets</h2>
      <p className="page-subtitle">
        Browse and manage all customer requests.
      </p>

      {/* Toolbar: search + status filter + new ticket */}
      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search by subject or customer..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="toolbar-filters">
          <button
            className={"chip" + (statusFilter === "all" ? " chip-active" : "")}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            className={"chip" + (statusFilter === "open" ? " chip-active" : "")}
            onClick={() => setStatusFilter("open")}
          >
            Open
          </button>
          <button
            className={
              "chip" + (statusFilter === "pending" ? " chip-active" : "")
            }
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
          <button
            className={
              "chip" + (statusFilter === "resolved" ? " chip-active" : "")
            }
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </button>
        </div>

        <button className="primary-button" onClick={openModal}>
          New Ticket
        </button>
      </div>

      {/* Tickets table */}
      <div className="card">
        {loading ? (
          <p className="muted">Loading tickets...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
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
              {filteredTickets.map((ticket) => (
                <tr key={ticket.internalId ?? ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.customer}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.priority}</td>
                  <td>
                    <select
                      className={`status-select status-${ticket.status.toLowerCase()}`}
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td>{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">
                    No tickets match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create New Ticket</h3>

            <form onSubmit={handleCreateTicket} className="modal-form">
              <label className="modal-field">
                <span>Customer</span>
                <input
                  name="customer"
                  type="text"
                  value={newTicket.customer}
                  onChange={handleNewTicketChange}
                  required
                />
              </label>

              <label className="modal-field">
                <span>Subject</span>
                <input
                  name="subject"
                  type="text"
                  value={newTicket.subject}
                  onChange={handleNewTicketChange}
                  required
                />
              </label>

              <label className="modal-field">
                <span>Priority</span>
                <select
                  name="priority"
                  value={newTicket.priority}
                  onChange={handleNewTicketChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <label className="modal-field">
                <span>Status</span>
                <select
                  name="status"
                  value={newTicket.status}
                  onChange={handleNewTicketChange}
                >
                  <option>Open</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
