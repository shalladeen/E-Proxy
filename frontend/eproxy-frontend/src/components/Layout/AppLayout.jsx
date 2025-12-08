import React from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppLayout({
  activePage,
  onNavChange,
  searchTerm,
  onSearchChange,
  children,
}) {
  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavChange={onNavChange} />

      <div className="main-area">
        <Topbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}