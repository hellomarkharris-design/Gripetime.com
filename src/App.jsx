import React from "react";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Respond from "./pages/Respond.jsx";
import Gripes from "./pages/Gripes.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <div className="wrap">
      <header className="header">
        <Sidebar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/respond" element={<Respond />} />
          <Route path="/gripes" element={<Gripes />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/legal" element={<Legal />} />
          {/* default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
