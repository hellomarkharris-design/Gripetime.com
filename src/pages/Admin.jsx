// src/pages/Admin.jsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

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

// Same admin helper as in main.jsx
function isAdminUser(user) {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.role === "admin") return true;
  const email = (user.email || "").toLowerCase();
  const name = (user.username || "").toLowerCase();
  if (email.includes("admin")) return true;
  if (name.includes("admin")) return true;
  return false;
}

export default function Admin() {
  const { isAuthed, currentUser } = useAuth();
  const [db, setDb] = useState(load());
  const [notes, setNotes] = useState({}); // admin notes keyed by gripe id

  if (!isAuthed) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Admin</h1>
        <p>You must sign in to access the Admin tools.</p>
      </main>
    );
  }

  const isAdmin = isAdminUser(currentUser);
  if (!isAdmin) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Admin</h1>
        <p>This area is for administrators only.</p>
      </main>
    );
  }

  const updateDb = (mutator) => {
    const next = { ...db, gripes: db.gripes.map((g) => ({ ...g })) };
    mutator(next);
    setDb(next);
    save(next);
  };

  const onNoteChange = (id, value) => {
    setNotes((n) => ({ ...n, [id]: value }));
  };

  const approveGripe = (id) => {
    updateDb((next) => {
      const g = next.gripes.find((x) => x.id === id);
      if (!g) return;
      g.status = "AwaitingResponse";
      if (!g.shareToken) {
        g.shareToken = Math.random().toString(36).slice(2);
      }
      g.adminNote = "";
    });
  };

  const deleteGripe = (id) => {
    updateDb((next) => {
      const g = next.gripes.find((x) => x.id === id);
      if (!g) return;
      g.status = "Deleted";
      g.adminNote = notes[id] || "";
    });
  };

  const approveResponseAndPost = (id) => {
    updateDb((next) => {
      const g = next.gripes.find((x) => x.id === id);
      if (!g || !g.gripeeDraft) return;
      g.gripee = { ...g.gripeeDraft };
      g.gripeeDraft = null;
      g.status = "Live"; // visible to Jury on Home
      g.adminNote = "";
    });
  };

  const deleteResponse = (id) => {
    updateDb((next) => {
      const g = next.gripes.find((x) => x.id === id);
      if (!g) return;
      g.gripeeDraft = null;
      if (g.status === "PendingResponse") {
        g.status = "AwaitingResponse";
      }
      g.adminNote = notes[id] || "";
    });
  };

  const pendingGripes = useMemo(
    () => db.gripes.filter((g) => g.status === "PendingGripe"),
    [db]
  );

  const pendingResponses = useMemo(
    () =>
      db.gripes.filter(
        (g) => g.status === "PendingResponse" && g.gripeeDraft
      ),
    [db]
  );

  // Build share link that opens Respond page with correct gripe/token (HashRouter)
  const base = window.location.origin + import.meta.env.BASE_URL;

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Admin</h1>
      <p style={{ marginBottom: 24 }}>
        Signed in as <strong>{currentUser?.username || currentUser?.email}</strong>.
      </p>

      {/* New Gripe review queue */}
      <section style={{ marginBottom: 32 }}>
        <h2>New Gripes to Review</h2>
        {pendingGripes.length === 0 ? (
          <p>No new gripes in the queue.</p>
        ) : (
          pendingGripes.map((g) => {
            const shareLink = g.shareToken
              ? `${base}#/respond?g=${encodeURIComponent(
                  g.id
                )}&t=${encodeURIComponent(g.shareToken)}`
              : "(approve gripe to generate link)";
            return (
              <div key={g.id} className="card" style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div>
                    <strong>ID:</strong> {g.id}
                    <br />
                    <strong>Status:</strong> {g.status}
                    <br />
                    <strong>Created:</strong>{" "}
                    {new Date(g.created).toLocaleString()}
                    <br />
                    <strong>Griper:</strong>{" "}
                    {g.createdBy || "Unknown"}
                  </div>
                  <div>
                    <button
                      className="btn"
                      style={{ marginRight: 8 }}
                      onClick={() => approveGripe(g.id)}
                    >
                      Approve Gripe
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => deleteGripe(g.id)}
                    >
                      Delete Gripe
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Griper Text:</strong>
                  <textarea
                    readOnly
                    style={{ width: "100%", minHeight: 80, marginTop: 4 }}
                    value={g.griper?.text || ""}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Admin Note to Griper (if deleted):</strong>
                  <textarea
                    style={{ width: "100%", minHeight: 60, marginTop: 4 }}
                    value={notes[g.id] || ""}
                    onChange={(e) => onNoteChange(g.id, e.target.value)}
                    placeholder="Optional note explaining why the gripe was deleted..."
                  />
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: "0.9em",
                    wordBreak: "break-all",
                  }}
                >
                  <strong>Share link for Gripee (email this):</strong>
                  <br />
                  {shareLink}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Response review queue */}
      <section>
        <h2>Responses to Review</h2>
        {pendingResponses.length === 0 ? (
          <p>No responses waiting for review.</p>
        ) : (
          pendingResponses.map((g) => (
            <div key={g.id} className="card" style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <strong>ID:</strong> {g.id}
                  <br />
                  <strong>Status:</strong> {g.status}
                </div>
                <div>
                  <button
                    className="btn"
                    style={{ marginRight: 8 }}
                    onClick={() => approveResponseAndPost(g.id)}
                  >
                    Approve &amp; Post for Jury
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => deleteResponse(g.id)}
                  >
                    Delete Response
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Griper Text (original):</strong>
                <textarea
                  readOnly
                  style={{ width: "100%", minHeight: 80, marginTop: 4 }}
                  value={g.griper?.text || ""}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Gripee Response (draft):</strong>
                <textarea
                  readOnly
                  style={{ width: "100%", minHeight: 80, marginTop: 4 }}
                  value={g.gripeeDraft?.text || ""}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Admin Note (if deleting response):</strong>
                <textarea
                  style={{ width: "100%", minHeight: 60, marginTop: 4 }}
                  value={notes[g.id] || ""}
                  onChange={(e) => onNoteChange(g.id, e.target.value)}
                  placeholder="Optional note explaining why the response was deleted..."
                />
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
