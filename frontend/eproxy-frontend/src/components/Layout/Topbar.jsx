import React from "react";

export default function Topbar() {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Support Dashboard</h1>

      <div className="topbar-right">
        <input
          className="topbar-search"
          placeholder="Search tickets..."
          type="text"
        />
        <div className="topbar-avatar">SH</div>
      </div>
    </header>
  );
}
