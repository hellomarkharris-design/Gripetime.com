// src/pages/Auth.jsx
import React, { useState } from "react";

const USERS_KEY = "gt_users_v1";
const CURRENT_USER_KEY = "gt_user_v1";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function goHome() {
  const base = import.meta.env.BASE_URL || "/";
  window.location.href = base;
}

export default function Auth() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const users = loadUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError("Email or password is incorrect.");
      return;
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    goHome();
  };

  return (
    <main className="card" style={{ maxWidth: 420, margin: "24px auto" }}>
      <h1>Sign In</h1>
      <p style={{ marginBottom: 16 }}>
        Sign in to Gripetime to create gripes, respond, and vote.
      </p>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
          />
        </label>

        <button className="btn" type="submit" style={{ marginTop: 8 }}>
          Sign In
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        New to Gripetime? <a href={`${import.meta.env.BASE_URL || "/"}signup`}>Create an account</a>
      </p>
    </main>
  );
}
