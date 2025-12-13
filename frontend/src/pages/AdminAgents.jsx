import React, { useEffect, useState } from "react";
import { getAgents, createAgent, updateAgent, deleteAgent } from "../api/agent";
import { uploadFiles } from "../api/property";
import AdminLayout from "../components/AdminLayout";

const AdminAgents = () => {
  const token = localStorage.getItem("token");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", photo: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!token) return;
    loadAgents();
  }, [token]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await getAgents(token);
      setAgents(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = form.photo;
      if (file) {
        const uploadRes = await uploadFiles([file], "agents", token);
        photoUrl = uploadRes.data.urls?.[0] || photoUrl;
      }

      if (editing) {
        await updateAgent(editing._id, { ...form, photo: photoUrl }, token);
        alert("Agent updated");
      } else {
        await createAgent({ ...form, photo: photoUrl }, token);
        alert("Agent created");
      }
      setForm({ name: "", email: "", phone: "", address: "", photo: "" });
      setFile(null);
      setEditing(null);
      loadAgents();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save agent");
    }
  };

  const handleEdit = (a) => {
    setEditing(a);
    setForm({ name: a.name, email: a.email, phone: a.phone, address: a.address || "", photo: a.photo || "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this agent?")) return;
    try {
      await deleteAgent(id, token);
      alert("Agent deleted");
      loadAgents();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <AdminLayout title={"Manage Agents"}>
      <div className="card mb-4 p-3 admin-card">
        <h5 className="mb-3">{editing ? "Edit Agent" : "Add Agent"}</h5>
        <form onSubmit={submit} className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Name</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Phone</label>
            <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <label className="form-label">Address</label>
            <input name="address" className="form-control" value={form.address} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Photo</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
          </div>
          <div className="col-12">
            <button className="btn btn-primary me-2" type="submit">{editing ? "Update" : "Create"}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm({ name: "", email: "", phone: "", address: "", photo: "" }); setFile(null); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : agents.length === 0 ? (
          <div className="alert alert-info">No agents found.</div>
        ) : (
          agents.map((a) => (
            <div className="col-md-4" key={a._id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column align-items-start">
                  <div className="d-flex gap-3 w-100">
                    <img src={a.photo || "/src/assets/profile.png"} alt={a.name} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }} />
                    <div>
                      <h5 className="mb-1">{a.name}</h5>
                      <p className="mb-1 small text-muted">{a.email}</p>
                      <p className="mb-1 small">{a.phone}</p>
                      <p className="mb-1 small text-muted">{a.address}</p>
                    </div>
                  </div>
                  <div className="mt-3 w-100 d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-danger btn-sm ms-auto" onClick={() => handleDelete(a._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAgents;
