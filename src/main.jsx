// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, NavLink, Routes, Route, Outlet } from "react-router-dom";

import "./styles.css";
import "./theme.css"; // ensure the themed styles are loaded

import { AuthProvider, useAuth } from "./AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Respond from "./pages/Respond.jsx";
import Gripes from "./pages/Gripes.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Base-aware logo path so it works locally and on GitHub Pages
const logoPath = `${import.meta.env.BASE_URL}gripetime-logo.png`;

function AuthWidget() {
  const { isAuthed, currentUser, logout } = useAuth();
  if (!isAuthed) {
    return (
      <div>
        <NavLink to="/login">Login</NavLink>
        {" "}
        <NavLink to="/signup">Signup</NavLink>
      </div>
    );
  }
  return (
    <div>
      <span>Hi, {currentUser?.username}</span>{" "}
      <button className="btn secondary" onClick={logout}>Logout</button>
    </div>
  );
}

function Layout() {
  return (
    <>
      <header className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoPath} alt="Gripetime" style={{ height: 48 }} />
          <nav>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/create">Create a Gripe</NavLink>
            <NavLink to="/respond">Respond</NavLink>
            <NavLink to="/gripes">Gripes</NavLink>
            <NavLink to="/rules">Rules</NavLink>
            <NavLink to="/legal">Legal</NavLink>
          </nav>
        </div>
        <AuthWidget />
      </header>
      <main className="wrap">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route
              path="create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />
            <Route
              path="respond"
              element={
                <ProtectedRoute>
                  <Respond />
                </ProtectedRoute>
              }
            />
            <Route path="gripes" element={<Gripes />} />
            <Route path="rules" element={<Rules />} />
            <Route path="legal" element={<Legal />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
