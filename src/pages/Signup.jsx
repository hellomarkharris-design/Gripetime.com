// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    juryOptIn: false,
  });
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
        throw new Error("All fields are required.");
      }
      // very simple email check
      if (!/.+@.+\..+/.test(form.email)) throw new Error("Please enter a valid email.");
      signup(form);
      nav("/"); // go home after signup
    } catch (e2) {
      setErr(e2.message || "Could not sign up.");
    }
  };

  return (
    <section className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Create your account</h2>
      {err && <p style={{ color: "#ff6b6b" }}>{err}</p>}
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input name="username" value={form.username} onChange={onChange} placeholder="pick a handle" />

        <label style={{ marginTop: 10 }}>Email</label>
        <input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />

        <label style={{ marginTop: 10 }}>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" />

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input type="checkbox" name="juryOptIn" checked={form.juryOptIn} onChange={onChange} />
          I’d like to be considered for a future Gripetime Jury
        </label>

        <div style={{ marginTop: 16 }}>
          <button className="btn" type="submit">Sign up</button>
        </div>
      </form>
      <p style={{ opacity: 0.7, marginTop: 12, fontSize: 12 }}>
        Demo build stores credentials in your browser only. We’ll swap in Firebase Auth later.
      </p>
    </section>
  );
}
