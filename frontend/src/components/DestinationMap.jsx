import React, { useState, useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, Sparkles, MapPin, UserRound } from 'lucide-react';
import { SafetyContext } from '../context/SafetyContext';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom DivIcons for different categories
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const redZoneIcon = createCustomIcon('#ef4444');
const hiddenGemIcon = createCustomIcon('#f59e0b');
const popularSpotIcon = createCustomIcon('#3b82f6');

const userLocationIcon = createCustomIcon('#10b981'); // Emerald green for user
const otherUserIcon = createCustomIcon('#8b5cf6'); // Purple for other users

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(
        [location.lat || location.latitude, location.lng || location.longitude],
        15
      );
    }
  }, [location, map]);

  return null;
}

const DestinationMap = ({ place }) => {
  const [showRedZones, setShowRedZones] = useState(true);
  const [showHiddenGems, setShowHiddenGems] = useState(true);
  const [showPopularSpots, setShowPopularSpots] = useState(true);
  
  const { currentLocation, locationPermissionStatus, requestLocationPermission, activeUsers } = useContext(SafetyContext);

  // Debug logs
  console.log("📍 Location:", currentLocation);
  console.log("🟢 Permission:", locationPermissionStatus);

  // Fallback coords if somehow missing
  const centerPosition = place.baseCoordinates || [31.1048, 77.1734]; 

  return (
    <div style={{
      borderRadius: '1rem',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      position: 'relative'
    }}>
      <MapContainer 
        center={centerPosition} 
        zoom={14} 
        style={{ height: '500px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showRedZones && place.redZones?.map(spot => (
          <Marker key={spot.id} position={spot.coordinates} icon={redZoneIcon}>
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <h4 style={{ color: '#ef4444', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                  <ShieldAlert size={16} /> {spot.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {showHiddenGems && place.hiddenGems?.map(spot => (
          <Marker key={spot.id} position={spot.coordinates} icon={hiddenGemIcon}>
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <h4 style={{ color: '#d97706', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                  <Sparkles size={16} /> {spot.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {showPopularSpots && place.popularSpots?.map(spot => (
          <Marker key={spot.id} position={spot.coordinates} icon={popularSpotIcon}>
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <h4 style={{ color: '#2563eb', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                  <MapPin size={16} /> {spot.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>{spot.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {currentLocation && <RecenterMap location={currentLocation} />}

        {locationPermissionStatus === 'granted' && currentLocation && (
          <Marker 
            position={[
              currentLocation.lat || currentLocation.latitude, 
              currentLocation.lng || currentLocation.longitude
            ]} 
            icon={userLocationIcon}
          >
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <h4 style={{ color: '#10b981', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                  <UserRound size={16} /> You Are Here
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>This is your current active location.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Multi-User Support (Future Ready) */}
        {activeUsers && activeUsers.map(user => (
          <Marker 
            key={user.id} 
            position={[user.lat, user.lng]} 
            icon={otherUserIcon}
          >
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <h4 style={{ color: '#8b5cf6', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                  <UserRound size={16} /> {user.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.4 }}>Registered User Location</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Control Panel Filter */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Map Filters</h3>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
          <input 
            type="checkbox" 
            checked={showRedZones} 
            onChange={(e) => setShowRedZones(e.target.checked)} 
            style={{ accentColor: '#ef4444', width: '16px', height: '16px' }} 
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', border: '1px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}></div>
          Red Zones
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
          <input 
            type="checkbox" 
            checked={showHiddenGems} 
            onChange={(e) => setShowHiddenGems(e.target.checked)} 
            style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }} 
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '1px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}></div>
          Hidden Gems
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
          <input 
            type="checkbox" 
            checked={showPopularSpots} 
            onChange={(e) => setShowPopularSpots(e.target.checked)} 
            style={{ accentColor: '#3b82f6', width: '16px', height: '16px' }} 
          />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', border: '1px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}></div>
          Popular Spots
        </label>
      </div>

      {/* Permission Fallback Message */}
      {locationPermissionStatus !== 'granted' && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          padding: '0.75rem 1.5rem',
          borderRadius: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Location access required to display your position
          </span>
          <button 
            onClick={requestLocationPermission}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: 0
            }}
          >
            Enable
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationMap;
