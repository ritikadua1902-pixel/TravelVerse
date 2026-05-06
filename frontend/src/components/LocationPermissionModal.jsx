import React, { useContext } from 'react';
import { SafetyContext } from '../context/SafetyContext';
import { MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

const LocationPermissionModal = () => {
  const { 
    showPermissionModal, 
    locationPermissionStatus, 
    handleAllowLocation, 
    handleDenyLocation 
  } = useContext(SafetyContext);

  if (!showPermissionModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          padding: '1rem',
          borderRadius: '50%',
          marginBottom: '1.5rem'
        }}>
          <MapPin size={40} color="#3b82f6" />
        </div>

        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: 'var(--text)', 
          margin: '0 0 1rem 0' 
        }}>
          Enable Location Access
        </h2>

        {locationPermissionStatus === 'denied' ? (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            textAlign: 'left'
          }}>
            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Location permission is currently denied. Please enable it from your browser settings to use safety features.
            </p>
          </div>
        ) : (
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1rem', 
            lineHeight: 1.6, 
            margin: '0 0 1.5rem 0' 
          }}>
            Enable location access to activate red zone alerts, safety tracking, and emergency SOS features. 
          </p>
        )}

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginBottom: '2rem',
          backgroundColor: 'rgba(21, 128, 61, 0.05)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          width: '100%'
        }}>
          <ShieldCheck size={18} color="#15803d" />
          <span style={{ textAlign: 'left' }}>Your location is only used for safety purposes and is not shared publicly.</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button 
            onClick={handleDenyLocation}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            Not Now
          </button>
          <button 
            onClick={handleAllowLocation}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
