// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { getMe, updateProfile } from "../api/auth";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await getMe(token);
        setUser(res.data);
        setEdit({ email: res.data.email || "", phone: res.data.phone || "" });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const handleChange = (e) => setEdit({ ...edit, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(edit, token);
      alert("Profile updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="profile-card">
      <div className="d-flex gap-4 align-items-center">
        <img src={user.profilePic || '/assets/default-avatar.png'} alt="avatar" className="profile-avatar" />
        <div>
          <h4 className="profile-name">{user.firstName} {user.lastName}</h4>
          <div className="profile-meta">{user.citizenshipNumber ? `Citizenship: ${user.citizenshipNumber}` : ""}</div>
        </div>
      </div>

      <hr className="divider" />

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input name="email" className="form-control" value={edit.email} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input name="phone" className="form-control" value={edit.phone} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Citizenship Number (locked)</label>
        <input className="form-control" value={user.citizenshipNumber || ""} disabled />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary-custom" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save changes"}</button>
      </div>
    </div>
  );
}
