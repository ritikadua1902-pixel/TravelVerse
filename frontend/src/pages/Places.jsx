import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, Leaf } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Places = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/places`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(21,128,61,0.1)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ color: 'var(--error)', fontSize: '1.25rem' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'timestamp', fontSize: '1.125rem' }}>
          <Leaf size={24} /> Eco-Destinations
        </div>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          color: 'var(--text)',
          display: 'block'
        }}>
          Explore Nature Responsibly
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover the top safety-verified, sustainable locations in Himachal Pradesh.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2.5rem'
      }}>
        {places.map((place, idx) => (
          <div key={place.id} className="glass-panel" style={{
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            animationDelay: `${idx * 0.1}s`,
            opacity: 0,
            animation: 'fadeInUp 0.6s ease forwards',
            background: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)';
          }}
          >
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img 
                src={place.image} 
                alt={place.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(21, 128, 61, 0.9)',
                backdropFilter: 'blur(4px)',
                padding: '0.4rem 0.8rem',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <MapPin size={14} /> Eco & Safe
              </div>
            </div>
            
            <div style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text)' }}>
                {place.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                {place.description}
              </p>
              
              <button 
                className="btn" 
                onClick={() => navigate(`/places/${place.id}`)}
                style={{
                  width: '100%',
                  background: 'rgba(21, 128, 61, 0.05)',
                  border: '1px solid rgba(21, 128, 61, 0.2)',
                  color: 'var(--primary)',
                  gap: '0.5rem',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(21, 128, 61, 0.05)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
              >
                <Info size={18} /> View Eco-Guide
              </button>
            </div>
          </div>
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </div>
    </div>
  );
};

export default Places;
