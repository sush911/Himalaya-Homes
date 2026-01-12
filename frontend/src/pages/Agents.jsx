import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Agents() {
  const { t } = useLanguage();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/agents/public`);
        setAgents(res.data || []);
      } catch (err) {
        console.error(err);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .agents-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%);
          padding: 60px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .agents-page::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(43, 91, 186, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .agents-page::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(30, 58, 95, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .agents-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .agents-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 24px;
        }
        
        .agents-header-content {
          flex: 1;
        }
        
        .agents-subtitle {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          color: #2B5BBA;
          font-weight: 700;
          margin-bottom: 12px;
        }
        
        .agents-title {
          font-size: 42px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }
        
        .agents-description {
          font-size: 17px;
          color: #666;
          line-height: 1.6;
          max-width: 600px;
        }
        
        .btn-back {
          height: 48px;
          padding: 0 28px;
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          color: #333;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .btn-back:hover {
          background: #2B5BBA;
          border-color: #2B5BBA;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.3);
        }
        
        .agents-stats {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          color: #fff;
          padding: 12px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(43, 91, 186, 0.3);
        }
        
        .agents-stats-icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .loading-container {
          text-align: center;
          padding: 120px 20px;
        }
        
        .loading-spinner {
          width: 56px;
          height: 56px;
          border: 5px solid rgba(43, 91, 186, 0.1);
          border-top-color: #2B5BBA;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .empty-state-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        
        .empty-state-title {
          font-size: 24px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 12px;
        }
        
        .empty-state-text {
          font-size: 16px;
          color: #666;
        }
        
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
        }
        
        .agent-card {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out backwards;
        }
        
        .agent-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #2B5BBA 0%, #1E3A5F 100%);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .agent-card:hover::before {
          transform: scaleX(1);
        }
        
        .agent-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(43, 91, 186, 0.2);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .agent-card:nth-child(1) { animation-delay: 0.1s; }
        .agent-card:nth-child(2) { animation-delay: 0.2s; }
        .agent-card:nth-child(3) { animation-delay: 0.3s; }
        .agent-card:nth-child(4) { animation-delay: 0.4s; }
        .agent-card:nth-child(5) { animation-delay: 0.5s; }
        .agent-card:nth-child(6) { animation-delay: 0.6s; }
        
        .agent-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .agent-avatar-wrapper {
          position: relative;
          margin-bottom: 24px;
        }
        
        .agent-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid #f0f5ff;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.15);
          transition: all 0.3s ease;
        }
        
        .agent-card:hover .agent-avatar {
          transform: scale(1.1);
          border-color: #2B5BBA;
          box-shadow: 0 12px 32px rgba(43, 91, 186, 0.25);
        }
        
        .agent-status {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: #10b981;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }
        
        .agent-info {
          width: 100%;
        }
        
        .agent-name {
          font-size: 22px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .agent-role {
          display: inline-block;
          background: linear-gradient(135deg, #e8f0fe 0%, #d6e4ff 100%);
          color: #2B5BBA;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        
        .agent-detail {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        .agent-detail:hover {
          background: #f0f5ff;
          color: #2B5BBA;
        }
        
        .agent-detail-icon {
          width: 18px;
          height: 18px;
          color: #2B5BBA;
          flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
          .agents-page {
            padding: 40px 16px;
          }
          
          .agents-title {
            font-size: 32px;
          }
          
          .agents-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .agents-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
      
      <div className="agents-page">
        <div className="agents-container container">
          <div className="agents-header">
            <div className="agents-header-content">
              <div className="agents-subtitle">{t('ourTeam')}</div>
              <h1 className="agents-title">{t('meetOurExperts')}</h1>
              <p className="agents-description">
                {t('trustedProfessionals')}
              </p>
            </div>
            <Link to="/" className="btn-back">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backHome')}
            </Link>
          </div>

          {!loading && agents.length > 0 && (
            <div className="agents-stats">
              <div className="agents-stats-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              {agents.length} {agents.length === 1 ? t('professionalAgents') : t('professionalAgentsPlural')} {t('available')}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">{t('loadingAgents')}</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="empty-state-title">{t('noAgentsAvailable')}</h3>
              <p className="empty-state-text">{t('checkBackSoon')}</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map((a) => (
                <div className="agent-card" key={a._id}>
                  <div className="agent-card-content">
                    <div className="agent-avatar-wrapper">
                      <img 
                        src={a.photo || "/src/assets/profile.png"} 
                        alt={a.name} 
                        className="agent-avatar" 
                      />
                      <div className="agent-status"></div>
                    </div>

                    <div className="agent-info">
                      <h3 className="agent-name">{a.name}</h3>
                      <span className="agent-role">{t('realEstateAgent')}</span>
                      
                      {a.address && (
                        <div className="agent-detail">
                          <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {a.address}
                        </div>
                      )}
                      
                      {a.email && (
                        <div className="agent-detail">
                          <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {a.email}
                        </div>
                      )}

                      {a.phone && (
                        <div className="agent-detail">
                          <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {a.phone}
                        </div>
                      )}
                    </div>

                    {/* Removed agent-actions section entirely */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

