// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, NavLink, Routes, Route, Outlet } from "react-router-dom";

import "./styles.css";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Respond from "./pages/Respond.jsx";
import Gripes from "./pages/Gripes.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";

const logoPath = "/gripetime-logo.png";

function Layout() {
  return (
    <>
      <header className="wrap">
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/create">Create a Gripe</NavLink>
          <NavLink to="/respond">Respond</NavLink>
          <NavLink to="/gripes">Gripes</NavLink>
          <NavLink to="/rules">Rules</NavLink>
          <NavLink to="/legal">Legal</NavLink>
        </nav>
      </header>
      <main className="wrap">
        <div className="center">
          <img src={logoPath} alt="Gripetime" style={{ height: 168 }} />
        </div>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="respond" element={<Respond />} />
          <Route path="gripes" element={<Gripes />} />
          <Route path="rules" element={<Rules />} />
          <Route path="legal" element={<Legal />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
