import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// ✅ Logo import (works when file exists at src/assets/gripetime-logo.png)
import logo from "./assets/gripetime-logo.png";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";

export default function App() {
  return (
    <div className="wrap" style={{ textAlign: "center" }}>
      
      {/* ✅ Logo at top */}
      <div style={{ padding: "20px" }}>
        <img
          src={logo}
          alt="Gripetime"
          style={{ width: "150px", marginBottom: "10px" }}
        />
      </div>

      {/* ✅ Navigation */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/rules">Rules</Link> |{" "}
        <Link to="/legal">Legal</Link>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </div>
  );
}
