import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";

export default function App() {
  return (
    <div className="wrap">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/rules">Rules</Link>
        <Link to="/legal">Legal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </div>
  );
}
