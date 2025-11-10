import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => (isActive ? "active" : undefined);

export default function Sidebar() {
  const logo = "/Gripetime.com/gripetime-logo.png"; // if you add it to /public

  return (
    <nav className="nav">
      <div className="brand">
        {/* If you haven't uploaded the logo yet, this <img> is optional */}
        <img src={logo} alt="Gripetime" onError={(e) => (e.currentTarget.style.display = "none")} />
        <span>Gripetime</span>
      </div>

      <NavLink to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/create" className={linkClass}>Create a Gripe</NavLink>
      <NavLink to="/respond" className={linkClass}>Respond</NavLink>
      <NavLink to="/gripes" className={linkClass}>Gripes</NavLink>
      <NavLink to="/rules" className={linkClass}>Rules</NavLink>
      <NavLink to="/legal" className={linkClass}>Legal</NavLink>
    </nav>
  );
}
