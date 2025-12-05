import React, { useState } from "react";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tickets from "./pages/Tickets.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    if (activePage === "dashboard") return <Dashboard />;
    if (activePage === "tickets") return <Tickets />;
    return <Dashboard />;
  };

  return (
    <AppLayout activePage={activePage} onNavChange={setActivePage}>
      {renderPage()}
    </AppLayout>
  );
}


