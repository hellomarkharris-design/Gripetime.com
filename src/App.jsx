import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";
import "./theme.css";

export default function App() {
  return (
    <div className="wrap">
      <h1>Gripetime</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/rules">Rules</Link> |{" "}
        <Link to="/legal">Legal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<div>Welcome to Gripetime!</div>} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </div>
  );
}
