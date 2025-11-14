// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Respond from "./pages/Respond.jsx";
import Gripes from "./pages/Gripes.jsx";
import Leaderboards from "./pages/Leaderboards.jsx";

import Auth from "./pages/Auth.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";
import Admin from "./pages/Admin.jsx";

// Base-aware logo path for GitHub Pages
const logo = `${import.meta.env.BASE_URL}gripetime-logo.png`;

export default function App() {
  return (
    <div className="wrap" style={{ textAlign: "center" }}>
      {/* Logo */}
      <div style={{ padding: 20 }}>
        <img
          src={logo}
          alt="Gripetime"
          style={{ width: 150, marginBottom: 10 }}
        />
      </div>

      {/* Top navigation bar */}
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home TEST</Link> |{" "}
        <Link to="/create">Create a Gripe</Link> |{" "}
        <Link to="/respond">Respond</Link> |{" "}
        <Link to="/gripes">Gripes</Link> |{" "}
        <Link to="/leaderboards">Leaderboards</Link> |{" "}
        {/* 👇 Admin button in the top row */}
        <Link to="/admin">Admin</Link> |{" "}
        <Link to="/auth">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/rules">Rules</Link> |{" "}
        <Link to="/legal">Legal</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/create" element={<Create />} />
        <Route path="/respond" element={<Respond />} />
        <Route path="/gripes" element={<Gripes />} />
        <Route path="/leaderboards" element={<Leaderboards />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/rules" element={<Rules />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </div>
  );
}
