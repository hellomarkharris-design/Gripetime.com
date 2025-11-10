import React, { useEffect, useState } from "react";

const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

export default function Gripes() {
  const [db, setDb] = useState(load());

  useEffect(() => {
    setDb(load());
  }, []);

  function show(id) {
    const d = load();
    d.selectedId = id;
    save(d);
    window.location.hash = "#/"; // go home
  }

  return (
    <section>
      <h2>All Gripes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {db.gripes.map((g) => {
          const age = Math.floor((Date.now() - g.created) / (1000 * 60 * 60 * 24));
          const badge =
            age <= 3 ? "age-green" : age <= 5 ? "age-yellow" : "age-red";
          return (
            <li key={g.id} className={`card ${badge}`}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><strong>{g.id}</strong><br />{age} day(s)</div>
                <button className="btn secondary" onClick={() => show(g.id)}>Show</button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
