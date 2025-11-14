// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// ✅ Works for GH Pages
const logo = `${import.meta.env.BASE_URL}gripetime-logo.png`;
const CURRENT_USER_KEY = "gt_user_v1";

const linkClass = ({ isActive }) =>
  isActive ? "nav-link is-active" : "nav-link";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="Gripetime Logo" className="brand-logo" />
        <div className="brand-name">Gripetime</div>
        {/* Updated tagline – no "Head-to-Head" */}
        <div className="brand-tag">Online Dispute Resolution</div>
      </div>

      <nav className="nav">
        <NavLink className={linkClass} to="/">Home</NavLink>
        <NavLink className={linkClass} to="/gripes">Gripes</NavLink>
        <NavLink className={linkClass} to="/create">Create</NavLink>
        <NavLink className={linkClass} to="/respond">Respond</NavLink>
        <NavLink className={linkClass} to="/leaderboards">Leaderboards</NavLink>

        {/* 👇 THIS is your Admin button */}
        <NavLink className={linkClass} to="/admin">Admin</NavLink>

        <NavLink className={linkClass} to="/auth">Sign In</NavLink>
        <NavLink className={linkClass} to="/signup">Sign Up</NavLink>
      </nav>

      <div style={{ marginTop: "auto", padding: "12px" }}>
        {user ? (
          <>
            <div style={{ fontSize: "0.9em", marginBottom: 8 }}>
              Signed in as <strong>{user.username || user.email}</strong>
            </div>
            <button
              className="btn secondary"
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <div style={{ fontSize: "0.9em" }}>Not signed in</div>
        )}
      </div>
    </aside>
  );
}
