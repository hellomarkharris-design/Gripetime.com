// src/pages/Respond.jsx
import React, { useMemo, useRef, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
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

const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const wc = (s = "") => (s.trim() ? s.trim().split(/\s+/).length : 0);
const clip = (s = "") => (wc(s) > 1000 ? s.split(/\s+/).slice(0, 1000).join(" ") : s);
const dt = (file) =>
  new Promise((r) => {
    const fr = new FileReader();
    fr.onload = (e) => r(e.target.result);
    fr.readAsDataURL(file);
  });

export default function Respond() {
  const { isAuthed } = useAuth();
  const inputRef = useRef(null);
  const [db, setDb] = useState(load());
  const [pickId, setPickId] = useState(db.selectedId || "");
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const selected = useMemo(() => db.gripes.find((g) => g.id === pickId) || null, [db, pickId]);
  const pick = () => inputRef.current?.click();
  const onDrop = (e) => { e.preventDefault(); setFiles(Array.from(e.dataTransfer.files || [])); };
  const onChoose = (e) => setFiles(Array.from(e.target.files || []));

  const onSave = async () => {
    if (!isAuthed) { setMsg("Please log in or sign up before responding."); return; }
    if (!selected) return alert("Pick a gripe first!");
    const imgs = await Promise.all(files.slice(0, 3).map(dt));
    const next = { ...db, gripes: db.gripes.map((g) => ({ ...g })) };
    const g = next.gripes.find((x) => x.id === selected.id);
    g.gripee.images = imgs;
    g.gripee.text = clip(text);
    setDb(next);
    save(next);
    location.hash = "#/";
  };

  return (
    <section className="card">
      <h2>Respond to a Gripe</h2>
      {!isAuthed && <p style={{ color: "#ffb347" }}>You must be logged in to save your response.</p>}
      {msg && <p style={{ color: "#ff6b6b" }}>{msg}</p>}

      <select style={{ width: "100%", padding: 10 }} value={pickId || ""} onChange={(e) => setPickId(e.target.value)}>
        {db.gripes.length === 0 ? <option>No gripes</option> : db.gripes.map((g) => (
          <option key={g.id} value={g.id}>{g.id}</option>
        ))}
      </select>

      <div className="grid2" style={{ marginTop: 10 }}>
        <div>
          <div className="drop" onClick={pick} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            Click or drop images
          </div>
          <input ref={inputRef} id="respFiles" type="file" accept="image/*" multiple hidden onChange={onChoose} />
          <div id="respCount">{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea rows={10} placeholder="Respond here..." value={text} onChange={(e) => setText(clip(e.target.value))} />
          <div id="respWords">{wc(text)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={onSave}>Save Response</button>
    </section>
  );
}
