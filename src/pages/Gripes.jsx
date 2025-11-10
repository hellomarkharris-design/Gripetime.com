// src/pages/Gripes.jsx
import React, { useMemo } from "react";

const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

export default function Gripes() {
  const db = useMemo(load, []);

  const show = (id) => {
    const next = { ...db, selectedId: id };
    save(next);
    location.hash = "#/";
  };

  if (db.gripes.length === 0) {
    return (
      <section className="card">
        <h2>All Gripes</h2>
        <p>No gripes yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>All Gripes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {db.gripes.map((g) => {
          const age = Math.floor((Date.now() - g.created) / (1000 * 60 * 60 * 24));
          const ageClass = age <= 3 ? "age-green" : age <= 5 ? "age-yellow" : "age-red";
          return (
            <li key={g.id} className={`card ${ageClass}`}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{g.id}</strong>
                  <br />
                  {age} day(s)
                </div>
                <button className="btn secondary" onClick={() => show(g.id)}>
                  Show
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
