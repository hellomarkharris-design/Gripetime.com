import React, { useEffect, useState } from "react";

const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const toDataURL = (file) =>
  new Promise((res) => {
    const fr = new FileReader();
    fr.onload = (e) => res(e.target.result);
    fr.readAsDataURL(file);
  });

export default function Respond() {
  const [db, setDb] = useState(load());
  const [sel, setSel] = useState(db.selectedId || "");
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => setDb(load()), []);

  async function saveResponse() {
    const imgs = await Promise.all(files.slice(0, 3).map(toDataURL));
    const d = load();
    const g = d.gripes.find((x) => x.id === sel);
    if (!g) return alert("Pick a gripe first!");
    g.gripee.images = imgs;
    g.gripee.text = text;
    save(d);
    alert("Response saved. Open Home to see it.");
    setFiles([]); setText("");
  }

  return (
    <section className="card">
      <h2>Respond to a Gripe</h2>

      <select style={{ width: "100%", padding: 10 }} value={sel} onChange={(e) => setSel(e.target.value)}>
        {db.gripes.length === 0 ? <option>No gripes</option> :
          db.gripes.map(g => <option key={g.id} value={g.id}>{g.id}</option>)
        }
      </select>

      <div className="grid2" style={{ marginTop: 10 }}>
        <div>
          <label className="drop" htmlFor="respFiles">Click or drop images</label>
          <input id="respFiles" type="file" accept="image/*" multiple hidden onChange={(e) => setFiles([...e.target.files])} />
          <div>{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea
            rows="10"
            placeholder="Respond here…"
            value={text}
            onChange={(e) => setText(e.target.value.split(/\s+/).slice(0, 1000).join(" "))}
          />
          <div>{(text.trim()?.split(/\s+/).length || 0)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={saveResponse}>Save Response</button>
    </section>
  );
}
