import React from "react";
import { NavLink } from "react-router-dom";

// ✅ Works for GH Pages
const logo = `${import.meta.env.BASE_URL}gripetime-logo.png`;

const linkClass = ({ isActive }) =>
  isActive ? "nav-link is-active" : "nav-link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="Gripetime Logo" className="brand-logo" />
        <div className="brand-name">Gripetime</div>
        <div className="brand-tag">Head-to-Head Dispute Resolution</div>
      </div>

      <nav className="nav">
        <NavLink className={linkClass} to="/">Home</NavLink>
        <NavLink className={linkClass} to="/gripes">Gripes</NavLink>
        <NavLink className={linkClass} to="/create">Create</NavLink>
        <NavLink className={linkClass} to="/respond">Respond</NavLink>
        <NavLink className={linkClass} to="/leaderboards">Leaderboards</NavLink>
        <NavLink className={linkClass} to="/admin">Admin</NavLink>
        <NavLink className={linkClass} to="/auth">Sign In</NavLink>
      </nav>
    </aside>
  );
}
