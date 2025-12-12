import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgetPassword";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import MyListing from "./pages/MyListing";
import Saved from "./pages/Saved";
import AdminPanel from "./pages/AdminPanel";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminProperties from "./pages/AdminProperties";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListing /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/admin/contact" element={<AdminRoute><AdminContactMessages /></AdminRoute>} />
            <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
            <Route path="/agents" element={<div className="coming-soon-container"><h2>Agents Page Coming Soon</h2></div>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}