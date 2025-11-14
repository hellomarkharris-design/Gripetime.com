// src/pages/Respond.jsx
import React, { useMemo, useRef, useState } from "react";

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

export default function Respond() {
  const user = getCurrentUser();

  // Require sign in for responding
  if (!user) {
    return (
      <section className="card">
        <h2>Sign in required</h2>
        <p>You need to sign in before you can respond to a gripe.</p>
        <button className="btn" onClick={goToSignIn}>
          Go to Sign In
        </button>
      </section>
    );
  }

  const [db, setDb] = useState(load());
  const inputRef = useRef(null);

  // Try to honor a share link like ?g=<id>&t=<token>
  const [pickId, setPickId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const gid = params.get("g");
    const token = params.get("t");
    const localDB = load();
    if (gid && token) {
      const match = localDB.gripes.find(
        (g) => g.id === gid && g.shareToken && g.shareToken === token
      );
      if (match) return gid;
    }
    return localDB.selectedId || "";
  });

  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  const selected = useMemo(
    () => db.gripes.find((g) => g.id === pickId) || null,
    [db, pickId]
  );

  const pick = () => inputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files || []));
  };

  const onChoose = (e) => setFiles(Array.from(e.target.files || []));
  const onChangeSelect = (e) => setPickId(e.target.value);

  const onSave = async () => {
    if (!selected) return alert("Pick a gripe first!");

    const imgs = await Promise.all(files.slice(0, 3).map(dt));
    const next = { ...db, gripes: db.gripes.map((g) => ({ ...g })) };
    const g = next.gripes.find((x) => x.id === selected.id);
    if (!g) return;

    // Save as draft, subject to Admin review
    g.gripeeDraft = {
      images: imgs,
      text: clip(text),
    };

    if (g.status === "AwaitingResponse") {
      g.status = "PendingResponse";
    }

    setDb(next);
    save(next);
    location.hash = "#/"; // back to home
  };

  return (
    <section className="card">
      <h2>Respond to a Gripe</h2>

      <select
        style={{ width: "100%", padding: 10 }}
        value={pickId || ""}
        onChange={onChangeSelect}
      >
        {db.gripes.length === 0 ? (
          <option>No gripes</option>
        ) : (
          db.gripes.map((g) => (
            <option key={g.id} value={g.id}>
              {g.id}
            </option>
          ))
        )}
      </select>

      <div className="grid2" style={{ marginTop: 10 }}>
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
            id="respFiles"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onChoose}
          />
          <div id="respCount">{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea
            rows={10}
            placeholder="Respond here..."
            value={text}
            onChange={(e) => setText(clip(e.target.value))}
          />
          <div id="respWords">{wc(text)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={onSave}>
        Submit Response for Review
      </button>
    </section>
  );
}
