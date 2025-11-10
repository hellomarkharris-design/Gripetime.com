import React, { useState } from "react";

const LS_KEY = "gt_v3";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || `{"gripes":[],"selectedId":null}`);
const save = (db) => localStorage.setItem(LS_KEY, JSON.stringify(db));

const toDataURL = (file) =>
  new Promise((res) => {
    const fr = new FileReader();
    fr.onload = (e) => res(e.target.result);
    fr.readAsDataURL(file);
  });

export default function Create() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");

  async function handleSave() {
    const imgs = await Promise.all(files.slice(0, 3).map(toDataURL));
    const db = load();
    const id = "g" + Math.random().toString(36).slice(2);
    db.gripes.unshift({
      id,
      status: "Active",
      created: Date.now(),
      votes: { L: 0, R: 0 },
      voted: {},
      griper: { images: imgs, text },
      gripee: { images: [], text: "" }
    });
    db.selectedId = id;
    save(db);
    alert("Draft saved. Open Home to see it.");
    setFiles([]); setText("");
  }

  return (
    <section className="card">
      <h2>Create a Gripe</h2>

      <div className="grid2">
        <div>
          <label className="drop" htmlFor="createFiles">Click or drop images</label>
          <input
            id="createFiles"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setFiles([...e.target.files])}
          />
          <div>{Math.min(3, files.length)} / 3 selected</div>
        </div>

        <div>
          <textarea
            rows="10"
            placeholder="Describe your gripe…"
            value={text}
            onChange={(e) => setText(e.target.value.split(/\s+/).slice(0, 1000).join(" "))}
          />
          <div>{(text.trim()?.split(/\s+/).length || 0)} / 1000 words</div>
        </div>
      </div>

      <button className="btn" onClick={handleSave}>Save Draft</button>
    </section>
  );
}
