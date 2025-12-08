import React from "react";

export default function Topbar({ searchTerm, onSearchChange }) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Support Dashboard</h1>

      <div className="topbar-right">
        <input
          className="topbar-search"
          placeholder="Search tickets..."
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="topbar-avatar">GRP1</div>
      </div>
    </header>
  );
}
