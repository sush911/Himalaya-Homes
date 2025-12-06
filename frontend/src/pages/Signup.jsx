// src/pages/Signup.jsx
import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import oImg from "../assets/o.jpg";

/* helper: convert file -> base64 */
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", citizenshipNumber: "", email: "", password: "", profilePic: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setForm({ ...form, profilePic: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await registerUser(payload);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-full">
      <div className="row g-0 w-100">
        {/* Left - Card */}
        <div className="col-md-5 auth-card d-flex align-items-center justify-content-center">
          <div className="card-auth">
            <h3 className="auth-heading">Create an account</h3>
            <div className="auth-sub">Set up your account to list properties, save favorites and contact owners.</div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex align-items-center">
                <div className="avatar-wrap">
                  <div className="avatar-preview" style={{ backgroundImage: `url(${form.profilePic || "/avatar-placeholder.png"})` }} />
                  <div>
                    <label className="form-label mb-1" style={{ fontWeight: 600 }}>Profile Photo</label>
                    <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleFile} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">First name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="form-control" />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Last name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Citizenship Number</label>
                <input name="citizenshipNumber" value={form.citizenshipNumber} onChange={handleChange} required className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" value={form.password} onChange={handleChange} required type="password" className="form-control" />
              </div>

              <div className="d-grid">
                <button disabled={loading} className="btn btn-primary-custom">{loading ? "Creating..." : "Create account"}</button>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">Already have an account? <Link to="/login" className="link-primary">Login</Link></small>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Image */}
        <div className="col-md-7 auth-image" style={{ backgroundImage: `url(${oImg})` }} />
      </div>
    </div>
  );
}
