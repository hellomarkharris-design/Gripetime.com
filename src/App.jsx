import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";


// Base-aware logo path
const logo = `${import.meta.env.BASE_URL}gripetime-logo.png`;

export default function App() {
  return (
    <div className="wrap" style={{ textAlign: "center" }}>
      <div style={{ padding: 20 }}>
        <img src={logo} alt="Gripetime" style={{ width: 150, marginBottom: 10 }} />
      </div>

      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/rules">Rules</Link> |{" "}
        <Link to="/legal">Legal</Link>
      </nav>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/gripes" element={<Gripes />} />
  <Route path="/create" element={<Create />} />
  <Route path="/respond" element={<Respond />} />
  <Route path="/leaderboards" element={<Leaderboards />} />
  <Route path="/admin" element={<Admin />} />   
  <Route path="/auth" element={<Auth />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/rules" element={<Rules />} />
  <Route path="/legal" element={<Legal />} />
</Routes>


    </div>
  );
}
