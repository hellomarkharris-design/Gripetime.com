// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "gt_users";
const CURRENT_KEY = "gt_currentUser";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function loadCurrent() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY)) || null; }
  catch { return null; }
}
function saveCurrent(user) {
  if (user) localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_KEY);
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers());
  const [currentUser, setCurrentUser] = useState(loadCurrent());

  useEffect(() => saveUsers(users), [users]);
  useEffect(() => saveCurrent(currentUser), [currentUser]);

  const signup = ({ username, email, password, juryOptIn }) => {
    const exists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) throw new Error("That username or email is already registered.");
    const newUser = {
      id: "u_" + Math.random().toString(36).slice(2),
      username,
      email,
      password, // Demo only; replace with a hash or Firebase in production
      juryOptIn: !!juryOptIn,
      createdAt: Date.now(),
    };
    const next = [newUser, ...users];
    setUsers(next);
    setCurrentUser({ id: newUser.id, username: newUser.username, email: newUser.email, juryOptIn: newUser.juryOptIn });
    return newUser;
  };

  const login = ({ usernameOrEmail, password }) => {
    const found = users.find(
      (u) =>
        u.password === password &&
        (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
         u.email.toLowerCase() === usernameOrEmail.toLowerCase())
    );
    if (!found) throw new Error("Invalid credentials.");
    setCurrentUser({ id: found.id, username: found.username, email: found.email, juryOptIn: found.juryOptIn });
    return found;
  };

  const logout = () => setCurrentUser(null);

  const value = useMemo(() => ({
    currentUser, users, signup, login, logout,
    isAuthed: !!currentUser,
  }), [currentUser, users]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
