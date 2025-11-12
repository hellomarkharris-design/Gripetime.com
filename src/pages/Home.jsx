// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

/** ===== Local DB helpers ===== */
const LS_KEY = "gt_v3";
const emptyDB = { gripes: [], selectedId: null };
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || emptyDB; } catch { return emptyDB; } };
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));
const browserId = localStorage.gtBrowserId || (localStorage.gtBrowserId = Math.random().toString(36).slice(2));

/** Small helpers */
const wc = (s = "") => (s.trim() ? s.trim().split(/\s+/).length : 0);
const clip = (s = "") => (wc(s) > 1000 ? s.split(/\s+/).slice(0, 1000).join(" ") : s);

function ImageBox({ data, alt, className, id }) {
  const style = data ? { background: `url(${data}) center/cover` } : undefined;
  return <div id={id} className={className} style={style}>{!data ? alt : null}</div>;
}

export default function Home() {
  const { isAuthed } = useAuth();
  const [db, setDb] = useState(load());
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!db.selectedId && db.gripes.length > 0) {
      const next = { ...db, selectedId: db.gripes[0].id };
      setDb(next); save(next);
    }
  }, [db]);

  const selected = useMemo(() => db.gripes.find((g) => g.id === db.selectedId) || null, [db]);

  const onSelect = (id) => { const next = { ...db, selectedId: id }; setDb(next); save(next); };

  const setStars = (side, stars) => {
    localStorage.setItem(`stars_${side}`, String(stars));
    setDb((d) => ({ ...d }));
  };

  const vote = (id, side) => {
    if (!isAuthed) { setMsg("Please log in or sign up before voting."); return; }
    const next = { ...db, gripes: db.gripes.map((g) => ({ ...g })) };
    const g = next.gripes.find((x) => x.id === id);
    if (!g) return;
    if (g.voted[browserId]) { alert("Already voted!"); return; }
    g.voted[browserId] = true;
    g.votes[side] += 1;
    setDb(next); save(next);
  };

  return (
    <section className="card">
      {msg && <p style={{ color: "#ff6b6b" }}>{msg}</p>}
      <select id="homeSelect" style={{ width: "100%", padding: 12, marginBottom: 12 }} value={db.selectedId || ""} onChange={(e) => onSelect(e.target.value)}>
        {db.gripes.length === 0 ? <option>No gripes yet</option> : db.gripes.map((g) => <option key={g.id} value={g.id}>{g.id}</option>)}
      </select>

      <div className="ring">
        {/* Left (GRIPER) */}
        <div className="card" id="homeLeft">
          <div className="cornerName red" style={{ fontSize: "1.5em" }}>GRIPER</div>
          <ImageBox id="homeLeftCircle" className="photoCircle" alt="PHOTO" data={selected?.griper.images[0]} />
          <ImageBox id="homeLeftMain" className="mainPhoto" alt="Main Image" data={selected?.griper.images[0]} />
          <div className="thumbs">
            <ImageBox id="homeLeftT2" className="thumb" alt="Photo 2" data={selected?.griper.images[1]} />
            <ImageBox id="homeLeftT3" className="thumb" alt="Photo 3" data={selected?.griper.images[2]} />
          </div>
          <br />
          <textarea id="homeLeftText" readOnly style={{ minHeight: 120 }} value={selected?.griper.text || ""} />
          <div className="voteRow">
            <div className="stars" id="starsL">
              {[1,2,3,4,5].map((s) => {
                const picked = Number(localStorage.getItem("stars_L")) === s;
                return (
                  <button key={s} onClick={() => setStars("L", s)} style={picked ? { background: "#2f3a85" } : undefined}>
                    {s}★
                  </button>
                );
              })}
            </div>
            <button className="btn" id="voteL" onClick={() => selected && vote(selected.id, "L")}>VOTE</button>
          </div>
        </div>

        {/* VS */}
        <div className="vs">VS</div>

        {/* Right (GRIPEE) */}
        <div className="card" id="homeRight">
          <div className="cornerName blue" style={{ fontSize: "1.5em" }}>GRIPEE</div>
          <ImageBox id="homeRightCircle" className="photoCircle" alt="PHOTO" data={selected?.gripee.images[0]} />
          <ImageBox id="homeRightMain" className="mainPhoto" alt="Main Image" data={selected?.gripee.images[0]} />
          <div className="thumbs">
            <ImageBox id="homeRightT2" className="thumb" alt="Photo 2" data={selected?.gripee.images[1]} />
            <ImageBox id="homeRightT3" className="thumb" alt="Photo 3" data={selected?.gripee.images[2]} />
          </div>
          <br />
          <textarea id="homeRightText" readOnly style={{ minHeight: 120 }} value={selected?.gripee.text || ""} />
          <div className="voteRow">
            <div className="stars" id="starsR">
              {[1,2,3,4,5].map((s) => {
                const picked = Number(localStorage.getItem("stars_R")) === s;
                return (
                  <button key={s} onClick={() => setStars("R", s)} style={picked ? { background: "#2f3a85" } : undefined}>
                    {s}★
                  </button>
                );
              })}
            </div>
            <button className="btn neon" id="voteR" onClick={() => selected && vote(selected.id, "R")}>VOTE</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        Griper: <span id="countL">{selected?.votes.L ?? 0}</span> | Gripee: <span id="countR">{selected?.votes.R ?? 0}</span>
      </div>
    </section>
  );
}
