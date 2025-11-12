// src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [creds, setCreds] = useState({ usernameOrEmail: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setCreds((c) => ({ ...c, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!creds.usernameOrEmail.trim() || !creds.password.trim()) {
        throw new Error("Both fields are required.");
      }
      login(creds);
      const dest = loc.state?.from || "/";
      nav(dest, { replace: true });
    } catch (e2) {
      setErr(e2.message || "Unable to log in.");
    }
  };

  return (
    <section className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Welcome back</h2>
      {err && <p style={{ color: "#ff6b6b" }}>{err}</p>}
      <form onSubmit={onSubmit}>
        <label>Username or Email</label>
        <input
          name="usernameOrEmail"
          value={creds.usernameOrEmail}
          onChange={onChange}
          placeholder="your username or email"
        />

        <label style={{ marginTop: 10 }}>Password</label>
        <input
          type="password"
          name="password"
          value={creds.password}
          onChange={onChange}
          placeholder="••••••••"
        />

        <div style={{ marginTop: 16 }}>
          <button className="btn" type="submit">Log in</button>
        </div>
      </form>
    </section>
  );
}
