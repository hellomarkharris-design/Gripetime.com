import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="wrap">
      <header className="header">
        <nav>
          <a className="brand" href="#/">Gripetime</a>
          <a href="#/">Home</a>
          <a href="#/create">Create a Gripe</a>
          <a href="#/respond">Respond</a>
          <a href="#/gripes">Gripes</a>
          <a href="#/rules">Rules</a>
          <a href="#/legal">Legal</a>
        </nav>
      </header>

      <main style={{ padding: 20 }}>
        <h1>Head-to-Head</h1>
        <p>Deployed via GitHub Pages + Vite.</p>
      </main>
    </div>
  );
}
