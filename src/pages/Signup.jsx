// src/pages/Signup.jsx
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

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function goHome() {
  const base = import.meta.env.BASE_URL || "/";
  window.location.href = base;
}

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    jury: true,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    const users = loadUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) {
      setError("An account with that email already exists. Please sign in.");
      return;
    }

    const newUser = {
      id: "u_" + Math.random().toString(36).slice(2),
      username,
      email,
      password, // NOTE: plain text only for demo; not secure for real production.
      jury: !!form.jury,
      createdAt: Date.now(),
    };

    const nextUsers = [...users, newUser];
    saveUsers(nextUsers);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    setMessage("Account created and you are signed in.");
    setForm({ username: "", email: "", password: "", jury: true });

    // Small delay just so the message is visible for a moment
    setTimeout(goHome, 600);
  };

  return (
    <main className="card" style={{ maxWidth: 480, margin: "24px auto" }}>
      <h1>Sign Up</h1>
      <p style={{ marginBottom: 16 }}>
        Create a Gripetime account so you can create gripes, respond, and vote.
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

      {message && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: "#e5ffe9",
            color: "#1b5e20",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Username *
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Email *
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Password *
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="jury"
            checked={form.jury}
            onChange={onChange}
          />
          I would like to be on a future Gripetime Jury
        </label>

        <button className="btn" type="submit" style={{ marginTop: 8 }}>
          Create Account
        </button>
      </form>
    </main>
  );
}
