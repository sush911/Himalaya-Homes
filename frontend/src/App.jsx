import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
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
        <Route path="/buy" element={<div className="coming-soon-container"><h2>Buy Page Coming Soon</h2></div>} />
        <Route path="/rent" element={<div className="coming-soon-container"><h2>Rent Page Coming Soon</h2></div>} />
        <Route path="/sell" element={<div className="coming-soon-container"><h2>Sell Page Coming Soon</h2></div>} />
        <Route path="/agents" element={<div className="coming-soon-container"><h2>Agents Page Coming Soon</h2></div>} />
        <Route path="/contact" element={<div className="coming-soon-container"><h2>Contact Page Coming Soon</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}
