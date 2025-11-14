// src/pages/Create.jsx
import React, { useRef, useState } from "react";

const LS_KEY = "gt_v3";
const load = () =>
  JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const wc = (s = "") => (s.trim() ? s.trim().split(/\s+/).length : 0);
const clip = (s = "") =>
  wc(s) > 1000 ? s.split(/\s+/).slice(0, 1000).join(" ") : s;
const dt = (file) =>
  new Promise((r) => {
    const fr = new FileReader();
    fr.onload = (e) => r(e.target.result);
    fr.readAsDataURL(file);
  });

// 🔐 Auth helpers
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

export default function Create() {
  const user = getCurrentUser();

  // If not signed in, show message instead of the form
  if (!user) {
    return (
      <section className="card">
        <h2>Sign in required</h2>
        <p>You need to sign in before you can create a gripe.</p>
        <button className="btn" onClick={goToSignIn}>
          Go to Sign In
        </button>
      </section>
    );
  }

  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  const pick = () => inputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    setFiles(list);
  };

  const onChoose = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const onSave = async () => {
    const db = load();
    const imgs = await Promise.all(files.slice(0, 3).map(dt));
    const id = "g" + Math.random().toString(36).slice(2);

    db.gripes.unshift({
      id,
      // 🔹 New review workflow fields
      status: "PendingGripe", // waiting for Admin review
      created: Date.now(),
      votes: { L: 0, R: 0 },
      voted: {},
      griper: { images: imgs, text: clip(text) },
      // live approved response (for Jury)
      gripee: { images: [], text: "" },
      // draft response waiting for Admin
      gripeeDraft: null,
      adminNote: "",
      shareToken: "", // filled when Admin approves Gripe
    });

    db.selectedId = id;
    save(db);
    setFiles([]);
    setText("");
    location.hash = "#/"; // back to home
  };

  return (
    <section className="card">
      <h2>Create a Gripe</h2>

      <div className="grid2">
        <div>
          <div
            className="drop"
            onClick={pick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            Click or drop images
          </div>
          <input
            ref={inputRef}
            id="createFiles"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onChoose}
          />
          <div id="createCount">{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea
            rows={10}
            placeholder="Describe your gripe..."
            value={text}
            onChange={(e) => setText(clip(e.target.value))}
          />
          <div id="createWords">{wc(text)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={onSave}>
        Submit for Review
      </button>
    </section>
  );
}
