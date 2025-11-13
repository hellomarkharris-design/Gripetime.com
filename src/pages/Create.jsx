// src/pages/Create.jsx
import React, { useRef, useState } from "react";
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

export default function Create() {
  const { isAuthed } = useAuth();
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const pick = () => inputRef.current?.click();
  const onDrop = (e) => { e.preventDefault(); setFiles(Array.from(e.dataTransfer.files || [])); };
  const onChoose = (e) => setFiles(Array.from(e.target.files || []));

  const onSave = async () => {
    if (!isAuthed) { setMsg("Please log in or sign up before creating a gripe."); return; }
    const db = load();
    const imgs = await Promise.all(files.slice(0, 3).map(dt));
    const id = "g" + Math.random().toString(36).slice(2);
    db.gripes.unshift({
      id,
      status: "Active",
      created: Date.now(),
      votes: { L: 0, R: 0 },
      voted: {},
      griper: { images: imgs, text: clip(text) },
      gripee: { images: [], text: "" },
    });
    db.selectedId = id;
    save(db);
    setFiles([]); setText("");
    location.hash = "#/";
  };

  return (
    <section className="card">
      <h2>Create a Gripe</h2>
      {!isAuthed && <p style={{ color: "#ffb347" }}>You must be logged in to save.</p>}
      {msg && <p style={{ color: "#ff6b6b" }}>{msg}</p>}

      <div className="grid2">
        <div>
          <div className="drop" onClick={pick} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            Click or drop images
          </div>
          <input ref={inputRef} id="createFiles" type="file" accept="image/*" multiple hidden onChange={onChoose} />
          <div id="createCount">{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea rows={10} placeholder="Describe your gripe..." value={text} onChange={(e) => setText(clip(e.target.value))} />
          <div id="createWords">{wc(text)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={onSave}>Save Draft</button>
    </section>
  );
}
