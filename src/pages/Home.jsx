import React, { useEffect } from "react";

/** Local storage mini DB */
const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));
const browserId = localStorage.gtBrowserId || (localStorage.gtBrowserId = Math.random().toString(36).slice(2));

export default function Home() {
  useEffect(() => {
    paint();
    // eslint-disable-next-line
  }, []);

  function img(el, data, alt) {
    if (!el || !data) { if (el) { el.textContent = alt; el.style.background = ""; } return; }
    el.textContent = "";
    el.style.background = `url(${data}) center/cover`;
  }

  function renderHome() {
    const db = load();
    const sel = document.getElementById("homeSelect");
    if (!sel) return;

    sel.innerHTML =
      db.gripes.map(g => `<option value="${g.id}" ${g.id === db.selectedId ? "selected" : ""}>${g.id}</option>`).join("") ||
      "<option>No gripes yet</option>";

    sel.onchange = () => {
      db.selectedId = sel.value;
      save(db);
      paint();
    };
  }

  function vote(id, side) {
    const db = load();
    const g = db.gripes.find(x => x.id === id);
    if (!g) return;
    if (g.voted[browserId]) return alert("Already voted!");
    g.voted[browserId] = true;
    g.votes[side]++;
    save(db);
    paint();
  }

  function paint() {
    renderHome();
    const db = load();
    const g = db.gripes.find(x => x.id === db.selectedId);
    if (!g) return;

    const L = { Circle: homeLeftCircle, Main: homeLeftMain, T2: homeLeftT2, T3: homeLeftT3, Text: homeLeftText };
    const R = { Circle: homeRightCircle, Main: homeRightMain, T2: homeRightT2, T3: homeRightT3, Text: homeRightText };

    img(L.Circle, g.griper.images[0], "PHOTO");
    img(L.Main,   g.griper.images[0], "Main");
    img(L.T2,     g.griper.images[1], "Photo 2");
    img(L.T3,     g.griper.images[2], "Photo 3");
    L.Text.value = g.griper.text || "";

    img(R.Circle, g.gripee.images[0], "PHOTO");
    img(R.Main,   g.gripee.images[0], "Main");
    img(R.T2,     g.gripee.images[1], "Photo 2");
    img(R.T3,     g.gripee.images[2], "Photo 3");
    R.Text.value = g.gripee.text || "";

    countL.textContent = g.votes.L;
    countR.textContent = g.votes.R;

    starsL.innerHTML = "";
    starsR.innerHTML = "";
    for (let s = 1; s <= 5; s++) {
      const setStars = (id, s) => () => (localStorage.setItem("stars_" + id, s), paint());
      const bL = document.createElement("button");
      const bR = document.createElement("button");
      bL.textContent = s + "★";
      bR.textContent = s + "★";
      if (Number(localStorage.getItem("stars_L")) === s) bL.style.background = "#2f3a85";
      if (Number(localStorage.getItem("stars_R")) === s) bR.style.background = "#2f3a85";
      bL.onclick = setStars("L", s);
      bR.onclick = setStars("R", s);
      starsL.appendChild(bL);
      starsR.appendChild(bR);
    }

    voteL.onclick = () => vote(g.id, "L");
    voteR.onclick = () => vote(g.id, "R");
  }

  return (
    <section className="card">
      <div className="title">HEAD <span>TO</span> HEAD</div>
      <div className="divider"></div>

      <select id="homeSelect" style={{ width: "100%", padding: 12, marginBottom: 12 }} />

      <div className="ring">
        {/* Left */}
        <div className="card" id="homeLeft">
          <div className="cornerName red">GRIPER</div>
          <div className="photoCircle" id="homeLeftCircle">PHOTO</div>
          <div className="mainPhoto" id="homeLeftMain">Main Image</div>
          <div className="thumbs">
            <div className="thumb" id="homeLeftT2">Photo 2</div>
            <div className="thumb" id="homeLeftT3">Photo 3</div>
          </div><br />
          <textarea id="homeLeftText" readOnly style={{ minHeight: 120 }} />
          <div className="voteRow">
            <div className="stars" id="starsL"></div>
            <button className="btn" id="voteL">VOTE</button>
          </div>
        </div>

        {/* VS */}
        <div className="vs">VS</div>

        {/* Right */}
        <div className="card" id="homeRight">
          <div className="cornerName blue">GRIPEE</div>
          <div className="photoCircle" id="homeRightCircle">PHOTO</div>
          <div className="mainPhoto" id="homeRightMain">Main Image</div>
          <div className="thumbs">
            <div className="thumb" id="homeRightT2">Photo 2</div>
            <div className="thumb" id="homeRightT3">Photo 3</div>
          </div><br />
          <textarea id="homeRightText" readOnly style={{ minHeight: 120 }} />
          <div className="voteRow">
            <div className="stars" id="starsR"></div>
            <button className="btn neon" id="voteR">VOTE</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        Griper: <span id="countL">0</span> | Gripee: <span id="countR">0</span>
      </div>
    </section>
  );
}
