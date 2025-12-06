import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/buy" element={<div style={{ padding: 30 }}>Buy Page Coming Soon</div>} />
        <Route path="/rent" element={<div style={{ padding: 30 }}>Rent Page Coming Soon</div>} />
        <Route path="/sell" element={<div style={{ padding: 30 }}>Sell Page Coming Soon</div>} />
        <Route path="/agents" element={<div style={{ padding: 30 }}>Agents Page Coming Soon</div>} />
        <Route path="/contact" element={<div style={{ padding: 30 }}>Contact Page Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}
