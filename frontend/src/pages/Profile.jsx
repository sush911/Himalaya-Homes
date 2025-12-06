// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { getMe, updateProfile } from "../api/auth";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const API_HOST = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000";

  const resolveImage = (src) => {
    if (!src) return '';
    // data URLs or absolute URLs
    if (src.startsWith('data:') || src.startsWith('http')) return src;
    // server-served uploads like '/uploads/filename'
    if (src.startsWith('/uploads') || src.startsWith('uploads')) return `${API_HOST}${src.startsWith('/') ? src : '/' + src}`;
    // otherwise return as-is
    return src;
  };

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
      // If a new file is selected, send multipart/form-data
      if (file) {
        const fd = new FormData();
        fd.append("profilePic", file);
        fd.append("email", edit.email);
        fd.append("phone", edit.phone);
        const res = await updateProfile(fd, token);
        // update local user state with returned profilePic if provided
        if (res?.data?.profilePic) setUser({ ...user, profilePic: res.data.profilePic });
      } else {
        await updateProfile(edit, token);
      }
      alert("Profile updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="profile-card">
      <div className="d-flex gap-4 align-items-center">
        <div>
          <img src={preview || resolveImage(user.profilePic) || '/assets/default-avatar.png'} alt="avatar" className="profile-avatar" />
        </div>
        <div>
          <h4 className="profile-name">{user.firstName} {user.lastName}</h4>
          <div className="profile-meta">{user.citizenshipNumber ? `Citizenship: ${user.citizenshipNumber}` : ""}</div>
        </div>
      </div>

      <hr className="divider" />

      <div className="mb-3">
        <label className="form-label">Change profile photo</label>
        <input type="file" accept="image/*" className="form-control" onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          setPreview(URL.createObjectURL(f));
        }} />
      </div>

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
