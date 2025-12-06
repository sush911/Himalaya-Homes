import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import oImg from "../assets/o.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    citizenshipNumber: "",
    email: "",
    password: "",
    profilePic: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0">

        {/* LEFT SIDE IMAGE */}
        <div className="col-md-7 d-none d-md-block">
          <img src={oImg} alt="image" className="w-100 h-100" style={{ objectFit: "cover" }} />
        </div>

        {/* RIGHT FORM */}
        <div className="col-md-5 d-flex align-items-center justify-content-center px-4">
          <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px", borderRadius: "12px" }}>
            <h3 className="fw-bold text-center mb-4" style={{ color: "var(--dark-blue)" }}>Create Account</h3>

            <form onSubmit={handleSignup}>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="text" name="phone" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Citizenship Number</label>
                <input type="text" name="citizenshipNumber" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required />
              </div>

              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "var(--primary-blue)" }}>
                Sign Up
              </button>

              <p className="text-center mt-3">
                Already have an account? <a href="/login" style={{ color: "var(--primary-blue)" }}>Login</a>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
