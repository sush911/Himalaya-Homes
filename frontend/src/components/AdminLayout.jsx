import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiLayers, FiUsers, FiMessageCircle, FiHome, FiLogOut, FiSearch } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Admin.css";

export default function AdminLayout({ title, children, controls }) {
  const { t } = useLanguage();
  const loc = useLocation();
  return (
    <div className="container py-4">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="card sticky-top admin-card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#2B5BBA,#1E3A5F)", display: "flex", alignItems: "center", justifyContent: "center", color: '#fff', fontWeight: 800, marginRight: 12 }}>HH</div>
                <div>
                  <div className="brand-title">Himalaya Homes</div>
                  <div className="small muted">Admin Console</div>
                </div>
              </div>

              <div className="list-group list-group-flush mt-3">
                <NavLink to="/admin" end className={({isActive}) => `list-group-item list-group-item-action${isActive? ' active' : ''}`}><FiLayers /> Property Requests</NavLink>
                <NavLink to="/admin/properties" className={({isActive}) => `list-group-item list-group-item-action${isActive? ' active' : ''}`}><FiHome /> All Properties</NavLink>
                <NavLink to="/admin/agents" className={({isActive}) => `list-group-item list-group-item-action${isActive? ' active' : ''}`}><FiUsers /> Manage Agents</NavLink>
                <NavLink to="/admin/contact" className={({isActive}) => `list-group-item list-group-item-action${isActive? ' active' : ''}`}><FiMessageCircle /> Contact Messages</NavLink>
              </div>

              <div className="mt-4">
                <button className="btn btn-outline-secondary w-100" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>
                  <FiLogOut style={{ marginRight: 8 }} /> Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-content">
          <div className="admin-topbar">
            <div>
              <div className="title">{title || 'Admin'}</div>
              <div className="text-muted small">{loc.pathname}</div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group" style={{ minWidth: 220 }}>
                <input className="form-control form-control-sm" placeholder="Search properties, agents..." />
                <button className="btn btn-sm btn-outline-secondary"><FiSearch /></button>
              </div>
              {controls}
            </div>
          </div>

          <div className="admin-content-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
