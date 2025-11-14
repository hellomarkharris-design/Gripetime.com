// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const LS_USER_KEY = "gt_user_v1";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load user from localStorage on startup
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load user", e);
    } finally {
      setReady(true);
    }
  }, []);

  const isAuthed = !!currentUser;

  const login = async (email, password) => {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) {
      throw new Error("Invalid credentials");
    }
    const saved = JSON.parse(raw);
    if (saved.email === email && saved.password === password) {
      setCurrentUser(saved);
      return;
    }
    throw new Error("Invalid credentials");
  };

  const signup = async ({ email, password, username }) => {
    const user = {
      email,
      password,
      username,
    };
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    // keep the saved credentials so you can log in again later
  };

  const value = {
    isAuthed,
    currentUser,
    login,
    signup,
    logout,
    ready,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
