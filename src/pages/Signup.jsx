// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const USERS_KEY = "gt_users_v1";

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

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [joinJury, setJoinJury] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Check for existing email
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("An account with that email already exists.");
      return;
    }

    // Create user object (prototype only – NOT secure for production)
    const newUser = {
      id: "u_" + Math.random().toString(36).slice(2),
      created: Date.now(),
      username: username.trim(),
      email: email.trim(),
      password, // ⚠️ For real apps, never store plain text passwords
      joinJury,
    };

    const updated = [newUser, ...users];
    saveUsers(updated);

    setSuccess("Account created! You can now sign in.");
    setUsername("");
    setEmail("");
    setPassword("");
    setJoinJury(false);

    // Optional: redirect to Sign In after a short delay
    setTimeout(() => {
      navigate("/auth");
    }, 1200);
  };

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <section className="card">
        <h2>Create Your Gripetime Account</h2>
        <p style={{ marginBottom: 16 }}>
          A Gripetime account lets you create gripes, respond, and vote.
        </p>

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#a11",
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#e5ffe9",
              color: "#146c2e",
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="GripetimeUser123"
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="you@example.com"
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
              placeholder="At least 6 characters"
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={joinJury}
              onChange={(e) => setJoinJury(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            I would like to be on a future Gripetime Jury.
          </label>

          <button type="submit" className="btn" style={{ width: "100%" }}>
            Create Account
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth")}
            style={{
              background: "none",
              border: "none",
              color: "#2f3a85",
              textDecoration: "underline",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Sign in here.
          </button>
        </p>
      </section>
    </main>
  );
}
