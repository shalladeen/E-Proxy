import React from "react";

export default function Sidebar({ activePage, onNavChange }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "tickets", label: "Tickets" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-dot" />
        <span className="logo-text">E-Proxy</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={
              "nav-item" +
              (activePage === item.key ? " nav-item-active" : "")
            }
            onClick={() => onNavChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
