import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    phone: "",
    email: ""
  });

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser(res.data);
        setEditableUser({
          phone: res.data.phone,
          email: res.data.email
        });
      })
      .catch((err) => console.log(err));
  }, [token]);

  const handleChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put("http://localhost:5000/api/user/update", editableUser, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => alert("Profile updated"))
      .catch((err) => console.log(err));
  };

  if (!user) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container mt-5">
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "12px"
        }}
      >
        <h3 className="text-center mb-3" style={{ color: "var(--dark-blue)" }}>
          My Profile
        </h3>

        <div className="d-flex justify-content-center mb-3">
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              backgroundColor: "#ddd",
              backgroundImage: `url(${user.profilePic})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </div>

        <h5 className="text-center mb-3">
          {user.firstName} {user.lastName}
        </h5>

        <div className="mb-3">
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={editableUser.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={editableUser.phone}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn text-white w-100"
          onClick={handleSave}
          style={{ backgroundColor: "var(--primary-blue)" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
