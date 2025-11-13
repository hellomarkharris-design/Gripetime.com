// src/pages/Dashboard.jsx
import React from "react";

const CURRENT_USER_KEY = "gt_user_v1";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function goToSignIn() {
  const base = import.meta.env.BASE_URL || "/";
  window.location.href = `${base}auth`;
}

export default function Dashboard() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <section className="card" style={{ maxWidth: 600, margin: "24px auto" }}>
        <h2>Dashboard</h2>
        <p>You need to sign in to view your dashboard.</p>
        <button className="btn" onClick={goToSignIn}>
          Go to Sign In
        </button>
      </section>
    );
  }

  return (
    <section className="card" style={{ maxWidth: 600, margin: "24px auto" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username || user.email}.</p>
      <p>
        You’re ready to create gripes, respond, and vote. Jury status:{" "}
        {user.jury ? "Opted In" : "Not on Jury list"}
      </p>
    </section>
  );
}
