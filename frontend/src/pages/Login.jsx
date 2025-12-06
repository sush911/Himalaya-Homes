import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import oImg from "../assets/o.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
      <div className="row g-0">

        {/* LEFT IMAGE */}
        <div className="col-md-7 d-none d-md-block">
          <img src={oImg} alt="real estate" className="w-100 h-100" style={{ objectFit: "cover" }} />
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="col-md-5 d-flex align-items-center justify-content-center px-4">
          <div className="card shadow p-4" style={{ width: "100%", maxWidth: "430px", borderRadius: "12px" }}>
            <h3 className="text-center mb-4 fw-bold" style={{ color: "var(--dark-blue)" }}>Login</h3>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" onChange={handleChange} required />
              </div>

              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "var(--primary-blue)" }}>
                Login
              </button>

              <p className="text-center mt-3">
                <a href="#" style={{ color: "var(--primary-blue)", fontWeight: "500" }}>Forgot Password?</a>
              </p>

              <p className="text-center mt-2">
                Don’t have an account? <a href="/signup" style={{ color: "var(--primary-blue)" }}>Sign Up</a>
              </p>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
