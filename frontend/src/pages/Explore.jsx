import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Map, Leaf } from 'lucide-react';

const Explore = () => {
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{
        marginTop: '3rem',
        padding: '5rem 3rem',
        borderRadius: '1.5rem',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(https://media.istockphoto.com/id/1044171380/photo/little-village-in-between-snow-caped-mountains-in-kalpa-himachal-pradesh.jpg?s=612x612&w=0&k=20&c=1-AKGnnJU2DIy_psBvvx-7J05bV3OG1fKlAg40Mfr8A=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.9)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '2rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Leaf size={16} /> Eco-Friendly Tourism
          </div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Welcome to Devbhoomi,<br />
            <span style={{ color: '#86efac' }}>{user?.name?.split(' ')[0] || 'Traveler'}</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            lineHeight: 1.6,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            fontWeight: '500'
          }}>
            Experience the majestic Himalayas safely and responsibly. We provide verified locations, safety guidelines, and curated experiences that protect our natural environment.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/places" className="btn btn-primary" style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem'
            }}>
              <Compass size={20} style={{ marginRight: '0.5rem' }} /> Explore Places
            </Link>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        {[
          {
            icon: <ShieldCheck size={32} color="var(--primary)" />,
            title: 'Safety First',
            desc: 'Real-time safety updates and verified emergency contact information for every destination.'
          },
          {
            icon: <Leaf size={32} color="var(--secondary)" />,
            title: 'Sustainable Travel',
            desc: 'Discover eco-friendly routes and accommodations that help preserve Himachal\'s pristine nature.'
          },
          {
            icon: <Map size={32} color="#059669" />,
            title: 'Curated Trails',
            desc: 'Get authentic local insights, safe hiking trails, and cultural etiquette guides.'
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel" style={{
            padding: '2.5rem 2rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            background: '#ffffff'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)';
            }}
          >
            <div style={{
              marginBottom: '1.5rem',
              background: 'rgba(21, 128, 61, 0.08)',
              width: '64px',
              height: '64px',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text)' }}>
              {feature.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
