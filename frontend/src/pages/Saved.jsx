import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "../api/property";
import { useLanguage } from "../context/LanguageContext";
import PropertyCardCompact from "../components/PropertyCardCompact";
import "../styles/Saved.css";

const Saved = () => {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const res = await getFavorites(token);
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load saved properties:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleFavorite = async (propertyId) => {
    try {
      await toggleFavorite(propertyId, token);
      // Remove from list after unfavoriting
      setItems(items.filter(item => item._id !== propertyId));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  if (!token) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" style={{ borderRadius: '12px' }}>
          Please login to view saved properties.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #2B5BBA', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#666', fontWeight: '600' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ fontSize: '28px', fontWeight: '700', color: '#1E3A5F' }}>Saved Properties</h2>
      {items.length === 0 ? (
        <div className="alert alert-info" style={{ borderRadius: '12px', border: '1px solid #bee5eb' }}>
          <p className="mb-0">No saved properties yet. Click the heart icon on any property to save it here.</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4" style={{ fontSize: '15px' }}>You have {items.length} saved property(ies)</p>
          <div className="row g-4">
            {items.map((p) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={p._id}>
                <PropertyCardCompact item={p} onFavorite={handleFavorite} showActions={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Saved;
