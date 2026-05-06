import React, { useContext, useEffect, useState } from 'react';
import { SafetyContext } from '../context/SafetyContext';
import { AlertTriangle, ShieldCheck, PhoneCall, MessageSquare, MapPin } from 'lucide-react';

const SOSWarningModal = () => {
  const { showSOSWarning, triggerSOS, resetSOS, emergencyContacts } = useContext(SafetyContext);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let interval;
    if (showSOSWarning) {
      setCountdown(30); // reset countdown when modal shows
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            triggerSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSOSWarning, triggerSOS]);

  if (!showSOSWarning) return null;

  const handleCall = () => {
    if (emergencyContacts && emergencyContacts.length > 0) {
      window.location.href = `tel:${emergencyContacts[0].phone}`;
    } else {
      window.location.href = `tel:100`;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '1.5rem',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '2px solid #ef4444',
      }}>
        <div style={{ 
          background: '#fee2e2', 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <AlertTriangle size={36} color="#ef4444" />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>
          🚨 Emergency Detected
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
            <MessageSquare size={16} color="#ef4444" />
            <span>📩 Preparing emergency message...</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
            <MapPin size={16} color="#ef4444" />
            <span>📍 Location attached</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
            <PhoneCall size={16} color="#ef4444" />
            <span>📞 Call option available</span>
          </div>
        </div>

        <div style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#ef4444',
          marginBottom: '1.5rem'
        }}>
          00:{countdown.toString().padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={triggerSOS}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
            }}
          >
            <MessageSquare size={20} /> Send SOS Message
          </button>

          <button 
            onClick={handleCall}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
            }}
          >
            <PhoneCall size={20} /> Call Emergency
          </button>
          
          <button 
            onClick={resetSOS}
            style={{
              background: 'white',
              color: '#059669',
              border: '2px solid #059669',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={20} /> I'm Safe
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSWarningModal;
