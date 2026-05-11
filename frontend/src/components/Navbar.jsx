import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Shield, Phone } from 'lucide-react';
import { SafetyContext } from '../context/SafetyContext';
import EmergencyContactsModal from './EmergencyContactsModal';

const Navbar = () => {
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }
  const { 
    requestLocationPermission, 
    locationPermissionStatus, 
    shareLocation, 
    toggleLocationSharing,
    isInRedZone,
    showSOSWarning,
    sosTriggered,
    sosCallStatus,
    simulateRedZoneEntry
  } = useContext(SafetyContext);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem'
      }}>
        <Link to={user ? "/explore" : "/login"} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--text)',
          textDecoration: 'none'
        }}>
          <MapPin color="var(--primary)" size={28} />
          Travel<span style={{color: 'var(--primary)'}}>Verse</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {locationPermissionStatus !== 'granted' && (
                <button 
                  onClick={requestLocationPermission}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <Shield size={16} /> Enable Safety
                </button>
              )}
              {locationPermissionStatus === 'granted' && (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }} title="Location is used only for safety purposes">
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3b82f6' }}>Share My Location</span>
                  <div style={{
                    width: '36px',
                    height: '20px',
                    background: shareLocation ? '#10b981' : '#d1d5db',
                    borderRadius: '10px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: shareLocation ? '18px' : '2px',
                      transition: 'left 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={shareLocation} 
                    onChange={toggleLocationSharing} 
                    style={{ display: 'none' }}
                  />
                </label>
              )}
              {locationPermissionStatus === 'granted' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '0.5rem' }}>
                  {sosTriggered ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#dc2626' }}>
                      🚨 SOS Triggered
                      {sosCallStatus === 'calling' && ' (📞 Calling...)'}
                      {sosCallStatus === 'success' && ' (✅ Calls Initiated)'}
                      {sosCallStatus === 'error' && ' (❌ Call Failed)'}
                    </span>
                  ) : showSOSWarning ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ea580c' }}>⏱ Timer Running</span>
                  ) : isInRedZone ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ef4444' }}>🔴 In Red Zone</span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981' }}>🟢 Safe Zone</span>
                  )}
                  
                  {!isInRedZone && !sosTriggered && (
                    <button 
                      onClick={() => simulateRedZoneEntry(true)}
                      style={{
                        background: '#111827', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '0.5rem'
                      }}
                    >
                      Force Test Red Zone
                    </button>
                  )}
                </div>
              )}
              {locationPermissionStatus === 'granted' && (
                <button
                  onClick={() => setIsContactsOpen(true)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                  title="Manage Emergency Contacts"
                >
                  <Phone size={16} /> Contacts
                </button>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={{
                  background: 'rgba(20, 184, 166, 0.1)',
                  color: '#0d9488',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  marginLeft: '0.5rem',
                  textDecoration: 'none'
                }}>
                  Admin Panel
                </Link>
              )}
              <span style={{ color: 'var(--text-muted)', fontWeight: '500', marginLeft: '0.5rem' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text)'}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
      <EmergencyContactsModal isOpen={isContactsOpen} onClose={() => setIsContactsOpen(false)} />
    </nav>
  );
};

export default Navbar;
