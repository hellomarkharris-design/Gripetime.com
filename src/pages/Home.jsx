// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import HeadtoHead from "../HeadtoHead.jsx";

/** ===== Local DB helpers (same shape as Create/Respond/Admin) ===== */
const LS_KEY = "gt_v3";
const emptyDB = { gripes: [], selectedId: null };
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || emptyDB;
  } catch {
    return emptyDB;
  }
};
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const browserId =
  localStorage.gtBrowserId ||
  (localStorage.gtBrowserId = Math.random()
    .toString(36)
    .slice(2));

/** Small helper for star selection */
function ImageBox({ data, alt, className, id }) {
  const style = data ? { background: `url(${data}) center/cover` } : undefined;
  return (
    <div id={id} className={className} style={style}>
      {!data ? alt : null}
    </div>
  );
}

export default function Home() {
  const [db, setDb] = useState(load());

  // ✅ Only show gripes that Admin has posted for the Jury
  const liveGripes = useMemo(
    () => db.gripes.filter((g) => g.status === "Live"),
    [db]
  );

  // keep selectedId pointing at a Live gripe, if any
  useEffect(() => {
    if (!liveGripes.length) return;
    const selectedIsLive = liveGripes.some((g) => g.id === db.selectedId);
    if (!selectedIsLive) {
      const next = { ...db, selectedId: liveGripes[0].id };
      setDb(next);
      save(next);
    }
  }, [db, liveGripes]);

  const selected =
    liveGripes.find((g) => g.id === db.selectedId) || liveGripes[0] || null;

  const onSelect = (id) => {
    const next = { ...db, selectedId: id };
    setDb(next);
    save(next);
  };

  const setStars = (side, stars) => {
    localStorage.setItem(`stars_${side}`, String(stars));
    setDb((d) => ({ ...d })); // trigger re-render
  };

  const vote = (id, side) => {
    const next = {
      ...db,
      gripes: db.gripes.map((g) => ({ ...g })),
    };
    const g = next.gripes.find((x) => x.id === id);
    if (!g) return;

    if (g.voted && g.voted[browserId]) {
      alert("You already voted on this gripe from this browser.");
      return;
    }

    if (!g.voted) g.voted = {};
    if (!g.votes) g.votes = { L: 0, R: 0 };

    g.voted[browserId] = true;
    g.votes[side] = (g.votes[side] || 0) + 1;

    setDb(next);
    save(next);
  };

  if (!liveGripes.length) {
    return (
      <section className="card">
        <h2>Gripetime Jury</h2>
        <p>No disputes have been posted for the Jury yet.</p>
      </section>
    );
  }

  const leftVotes = selected?.votes?.L ?? 0;
  const rightVotes = selected?.votes?.R ?? 0;

  return (
    <section className="card">
      {/* 🔹 Head-to-Head theme banner */}
      <HeadToHead
        leftTitle="Griper"
        rightTitle="Gripee"
        leftCount={leftVotes}
        rightCount={rightVotes}
        onVoteLeft={() => selected && vote(selected.id, "L")}
        onVoteRight={() => selected && vote(selected.id, "R")}
      />

      {/* Select which Live gripe to view */}
      <select
        id="homeSelect"
        style={{ width: "100%", padding: 12, margin: "16px 0" }}
        value={selected?.id || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        {liveGripes.map((g) => (
          <option key={g.id} value={g.id}>
            {g.id}
          </option>
        ))}
      </select>

      {/* Original head-to-head ring layout (GRIPER vs GRIPEE) */}
      <div className="ring">
        {/* Left (GRIPER) */}
        <div className="card" id="homeLeft">
          <div className="cornerName red" style={{ fontSize: "1.5em" }}>
            GRIPER
          </div>

          <ImageBox
            id="homeLeftCircle"
            className="photoCircle"
            alt="PHOTO"
            data={selected?.griper?.images?.[0]}
          />
          <ImageBox
            id="homeLeftMain"
            className="mainPhoto"
            alt="Main Image"
            data={selected?.griper?.images?.[0]}
          />

          <div className="thumbs">
            <ImageBox
              id="homeLeftT2"
              className="thumb"
              alt="Photo 2"
              data={selected?.griper?.images?.[1]}
            />
            <ImageBox
              id="homeLeftT3"
              className="thumb"
              alt="Photo 3"
              data={selected?.griper?.images?.[2]}
            />
          </div>
          <br />

          <textarea
            id="homeLeftText"
            readOnly
            style={{ minHeight: 120 }}
            value={selected?.griper?.text || ""}
          />

          <div className="voteRow">
            <div className="stars" id="starsL">
              {[1, 2, 3, 4, 5].map((s) => {
                const picked = Number(localStorage.getItem("stars_L")) === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStars("L", s)}
                    style={picked ? { background: "#2f3a85" } : undefined}
                  >
                    {s}★
                  </button>
                );
              })}
            </div>
            <button
              className="btn"
              id="voteL"
              onClick={() => selected && vote(selected.id, "L")}
            >
              VOTE
            </button>
          </div>
        </div>

        {/* VS */}
        <div className="vs">VS</div>

        {/* Right (GRIPEE) */}
        <div className="card" id="homeRight">
          <div className="cornerName blue" style={{ fontSize: "1.5em" }}>
            GRIPEE
          </div>

          <ImageBox
            id="homeRightCircle"
            className="photoCircle"
            alt="PHOTO"
            data={selected?.gripee?.images?.[0]}
          />
          <ImageBox
            id="homeRightMain"
            className="mainPhoto"
            alt="Main Image"
            data={selected?.gripee?.images?.[0]}
          />

          <div className="thumbs">
            <ImageBox
              id="homeRightT2"
              className="thumb"
              alt="Photo 2"
              data={selected?.gripee?.images?.[1]}
            />
            <ImageBox
              id="homeRightT3"
              className="thumb"
              alt="Photo 3"
              data={selected?.gripee?.images?.[2]}
            />
          </div>
          <br />

          <textarea
            id="homeRightText"
            readOnly
            style={{ minHeight: 120 }}
            value={selected?.gripee?.text || ""}
          />

          <div className="voteRow">
            <div className="stars" id="starsR">
              {[1, 2, 3, 4, 5].map((s) => {
                const picked = Number(localStorage.getItem("stars_R")) === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStars("R", s)}
                    style={picked ? { background: "#2f3a85" } : undefined}
                  >
                    {s}★
                  </button>
                );
              })}
            </div>
            <button
              className="btn neon"
              id="voteR"
              onClick={() => selected && vote(selected.id, "R")}
            >
              VOTE
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        Griper: <span id="countL">{leftVotes}</span> | Gripee:{" "}
        <span id="countR">{rightVotes}</span>
      </div>
    </section>
  );
}
