import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Shield, Leaf, CloudSun, AlertTriangle, Droplets, Mountain } from 'lucide-react';
import DestinationMap from '../components/DestinationMap';
import WeatherCard from '../components/WeatherCard';
import { API_BASE_URL } from '../config';
const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/places`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        const foundPlace = data.find(p => p._id === id);
        if (foundPlace) {
          setPlace(foundPlace);
          console.log("Current Destination:", foundPlace);
        } else {
          setError('Destination not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (place && place.baseCoordinates && place.baseCoordinates.length >= 2) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/weather/${place.baseCoordinates[0]}/${place.baseCoordinates[1]}`);
          if (response.ok) {
            const data = await response.json();
            setWeather(data);
            setWeatherError(false);
          } else {
            setWeatherError(true);
          }
        } catch (err) {
          console.error("Failed to fetch weather:", err);
          setWeatherError(true);
        }
      }
    };
    fetchWeather();
  }, [place]);

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
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ color: 'var(--error)', fontSize: '1.25rem', marginBottom: '1rem' }}>{error}</div>
        <button onClick={() => navigate('/places')} className="btn btn-primary">
          Back to Places
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate('/places')} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '1.5rem',
          marginBottom: '1.5rem',
          padding: '0.5rem 0',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={20} /> Back to Destinations
      </button>

      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, background: '#ffffff' }}>
        <div style={{ position: 'relative', height: '400px', width: '100%' }}>
          <img 
            src={place.image} 
            alt={place.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            padding: '3rem 2rem 2rem 2rem',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#86efac', marginBottom: '0.2rem' }}>{place?.name}</h2>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{place.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', opacity: 0.9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={18} /> Himachal Pradesh Focus Location
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6ee7b7' }}>
                <Shield size={18} /> Safety Verified
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem', padding: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>
              About {place.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {place.description} This region is known for its breathtaking landscapes and pristine environment. By visiting {place.name}, you are taking part in promoting sustainable tourism that preserves the natural beauty of the Himalayas for generations to come.
            </p>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Leaf color="var(--primary)" size={28} /> Eco-Tourism Guidelines
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Droplets size={20} color="#0284c7" />, text: "Use biodegradable products and avoid single-use plastics to protect local water sources." },
                { icon: <Mountain size={20} color="#9a3412" />, text: "Stick to designated trails to prevent soil erosion and protect fragile alpine flora." },
                { icon: <CloudSun size={20} color="#ca8a04" />, text: "Respect local customs, wildlife habitats, and always carry your trash back with you." }
              ].map((item, idx) => (
                <li key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(21, 128, 61, 0.04)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(21, 128, 61, 0.1)'
                }}>
                  <div style={{ marginTop: '0.2rem' }}>{item.icon}</div>
                  <span style={{ color: 'var(--text)', lineHeight: 1.6 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{
              background: 'rgba(220, 38, 38, 0.05)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={22} /> Safety Alert
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Weather in high altitude areas can change rapidly. Always check local advisories before starting your journey. Ensure you have emergency medical contacts saved.
              </p>
              {!showContacts ? (
                <button className="btn" onClick={() => setShowContacts(true)} style={{ 
                  width: '100%', 
                  background: '#dc2626', 
                  color: 'white',
                  fontSize: '0.95rem',
                  padding: '0.6rem 1rem',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '0.5rem'
                }}>
                  View Emergency Contacts
                </button>
              ) : (
                <div style={{ marginTop: '1rem', background: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--text)' }}>Police: <span style={{ color: 'var(--error)' }}>100</span></p>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--text)' }}>Medical / Ambulance: <span style={{ color: 'var(--error)' }}>108</span></p>
                  <p style={{ margin: '0', fontWeight: '600', color: 'var(--text)' }}>Local Rescue: <span style={{ color: 'var(--error)' }}>112</span></p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <WeatherCard weather={weather} />
            </div>

            <div style={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>
                Quick Facts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Currently Open</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Weather</span>
                  <span style={{ fontWeight: '600' }}>
                    {weather 
                      ? `${Math.round(weather.temp)}°C / ${weather.condition}` 
                      : weatherError 
                        ? 'Weather Unavailable' 
                        : 'Loading...'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Best Time</span>
                  <span style={{ fontWeight: '600' }}>Mar - Jun</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MapPin color="var(--primary)" size={28} /> Destination Map
        </h2>
        <DestinationMap place={place} />
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ background: '#ffffff', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#ef4444' }}>
            Red Zones
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {place.redZones?.map(spot => (
              <li key={spot._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text)' }}>{spot.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{spot.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-panel" style={{ background: '#ffffff', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#d97706' }}>
            Hidden Gems
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {place.hiddenGems?.map(spot => (
              <li key={spot._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text)' }}>{spot.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{spot.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
