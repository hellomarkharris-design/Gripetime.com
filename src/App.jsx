import logo from './assets/gripetime-logo.png';
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rules from "./pages/Rules.jsx";
import Legal from "./pages/Legal.jsx";

export default function App() {
  return (
    <div className="wrap" style={{ textAlign: "center" }}>
      
      {/* ✅ Logo at top of all pages */}
      <div style={{ padding: "20px" }}>
        <img 
         
