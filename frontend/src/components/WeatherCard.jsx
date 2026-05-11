import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, AlertTriangle } from 'lucide-react';

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading live weather...</div>
      </div>
    );
  }

  const getSafetyAdvice = (condition, temp) => {
    if (condition === 'Rain' || condition === 'Drizzle') {
      return {
        text: 'Caution: Slippery roads and potential landslides in hilly areas. Avoid trekking.',
        type: 'warning',
        color: '#ef4444'
      };
    }
    if (condition === 'Snow') {
      return {
        text: 'Heavy Snow: High risk of road closures. Carry chains and warm gear.',
        type: 'danger',
        color: '#dc2626'
      };
    }
    if (condition === 'Thunderstorm') {
      return {
        text: 'Thunderstorm: Stay indoors. Avoid open ridges and tall trees.',
        type: 'danger',
        color: '#dc2626'
      };
    }
    if (temp < 0) {
      return {
        text: 'Freezing Temps: Risk of black ice on roads. Drive with extreme caution.',
        type: 'warning',
        color: '#f59e0b'
      };
    }
    return {
      text: 'Weather looks good for travel. Maintain standard mountain safety.',
      type: 'info',
      color: 'var(--primary)'
    };
  };

  const advice = getSafetyAdvice(weather.condition, weather.temp);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear': return <Sun size={48} color="#f59e0b" />;
      case 'Rain': 
      case 'Drizzle': return <CloudRain size={48} color="#3b82f6" />;
      case 'Snow': return <CloudSnow size={48} color="#94a3b8" />;
      case 'Clouds': return <Cloud size={48} color="#64748b" />;
      default: return <Cloud size={48} color="#64748b" />;
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderLeft: `6px solid ${advice.color}`,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', margin: 0 }}>Live Weather</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>{weather.city || 'Current Location'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {Math.round(weather.temp)}°C
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {getWeatherIcon(weather.condition)}
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1.1rem' }}>{weather.condition}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{weather.description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Droplets size={16} /> Humidity: {weather.humidity}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Wind size={16} /> Wind: {weather.windSpeed} m/s
          </div>
        </div>
      </div>

      <div style={{ 
        background: `${advice.color}10`, 
        padding: '1rem', 
        borderRadius: '0.75rem', 
        display: 'flex', 
        gap: '0.75rem',
        border: `1px solid ${advice.color}30`
      }}>
        <AlertTriangle size={20} color={advice.color} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <div style={{ fontWeight: '700', color: advice.color, fontSize: '0.9rem', marginBottom: '0.2rem' }}>SAFETY ADVICE</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.4 }}>{advice.text}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
