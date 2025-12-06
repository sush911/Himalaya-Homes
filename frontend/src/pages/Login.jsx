// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import oImg from "../assets/o.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      // optional: store user info in localStorage if returned
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      alert(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-full">
      <div className="row g-0 w-100">
        {/* Left - Card */}
        <div className="col-md-5 auth-card d-flex align-items-center justify-content-center">
          <div className="card-auth">
            <h3 className="auth-heading">Welcome back</h3>
            <div className="auth-sub">Login to access saved properties, contact owners and post listings.</div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required className="form-control" placeholder="you@example.com" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className="form-control" placeholder="••••••••" />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary-custom" type="submit">{loading ? "Signing in..." : "Login"}</button>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <Link to="/forgot" className="link-primary">Forgot password?</Link>
                <Link to="/signup" className="link-primary">Create account</Link>
              </div>

              <div className="text-center mt-3">
                <div style={{ fontSize: 13, color: "rgba(51,51,51,0.65)" }}>or continue with</div>
                <button type="button" className="btn btn-outline-custom mt-2">Login with Google (soon)</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Image (40%) */}
        <div className="col-md-7 auth-image" style={{ backgroundImage: `url(${oImg})` }} />
      </div>
    </div>
  );
}
