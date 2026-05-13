import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';
export const SafetyContext = createContext();

const socket = io(API_BASE_URL, {
  withCredentials: true
});

export const SafetyProvider = ({ children }) => {
  const [locationPermissionStatus, setLocationPermissionStatus] = useState(() => {
    return localStorage.getItem('locationPermissionStatus') || 'pending';
  });
  const [placesData, setPlacesData] = useState([]);
  const [reportedHazards, setReportedHazards] = useState([]);
  const [liveActiveUsersCount, setLiveActiveUsersCount] = useState(0);

  useEffect(() => {
    // Listen for real-time updates
    socket.on('activeUsersUpdate', (count) => {
      setLiveActiveUsersCount(count);
    });

    socket.on('hazardReported', (hazard) => {
      setReportedHazards(prev => [hazard, ...prev]);
      
      // Notify the user in real-time
      toast.error(
        <div>
          <strong className="text-red-500 font-bold">⚠️ REAL-TIME HAZARD ALERT</strong>
          <p className="text-xs mt-1">
            <strong>{hazard.type}</strong> reported by {hazard.reportedByName}.
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">{hazard.description}</p>
        </div>,
        { duration: 6000, position: 'top-right' }
      );
    });

    return () => {
      socket.off('activeUsersUpdate');
      socket.off('hazardReported');
    };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/places`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPlacesData(data))
      .catch(err => console.error('Error fetching places:', err));
    
    // Fetch existing hazards (Optional: Implement endpoint if needed, for now we rely on real-time)
  }, []);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [shareLocation, setShareLocation] = useState(false);
  const [activeUsers, setActiveUsers] = useState([
    // Mock user for future-ready testing
    { id: 'user_2', name: 'Alice', lat: 31.1050, lng: 77.1740 },
    { id: 'user_3', name: 'Bob', lat: 31.1030, lng: 77.1720 }
  ]);

  const [isInRedZone, setIsInRedZone] = useState(false);
  const [showSOSWarning, setShowSOSWarning] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Sync state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('locationPermissionStatus', locationPermissionStatus);
  }, [locationPermissionStatus]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    let timer;
    if (isInRedZone && !showSOSWarning && !sosTriggered) {
      console.log("Entered Red Zone - Timer Started");
      timer = setTimeout(() => {
        console.log("⚠️ Showing Warning Modal");
        setShowSOSWarning(true);
      }, 15000); // 15 seconds test mode
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
        console.log("Exited Red Zone / Timer Cleared");
      }
    };
  }, [isInRedZone, showSOSWarning, sosTriggered]);

  const triggerSOS = useCallback(() => {
    console.log("🚨 SOS Triggered");
    setSosTriggered(true);
    setShowSOSWarning(false);
    
    const lat = currentLocation?.lat || 'Unknown';
    const lng = currentLocation?.lng || 'Unknown';

    // Get personal contacts from localStorage
    const savedContacts = localStorage.getItem('emergencyContacts');
    let personalContacts = [];
    if (savedContacts) {
      try {
        personalContacts = JSON.parse(savedContacts);
      } catch (e) {
        console.error('Error parsing contacts');
      }
    }

    const defaultContacts = [
      { name: 'Police', phone: '100' },
      { name: 'Hospital', phone: '108' }
    ];

    const allContacts = [...defaultContacts, ...personalContacts];
    const phoneNumbers = allContacts.map(c => c.phone).join(",");

    const message = `🚨 SOS ALERT!
I might be in danger.

📍 My Location:
https://maps.google.com/?q=${lat},${lng}

Please help me immediately.`;

    window.location.href = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;
    
    console.log("📡 SOS SMS Initiated:", {
      type: "SOS",
      userLocation: { lat, lng },
      timestamp: new Date().toISOString()
    });
  }, [currentLocation]);

  const resetSOS = useCallback(() => {
    setShowSOSWarning(false);
    setSosTriggered(false);
  }, []);

  const simulateRedZoneEntry = useCallback((status) => {
    setIsInRedZone(status);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  }, [watchId]);

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    if (watchId !== null) {
      // Already tracking
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setCurrentLocation(newLocation);
        
        let inRedZone = false;
        for (const place of placesData) {
          if (place.redZones) {
             for (const zone of place.redZones) {
                if (!zone.coordinates || !Array.isArray(zone.coordinates)) continue;
                const dist = calculateDistance(newLocation.lat, newLocation.lng, zone.coordinates[0], zone.coordinates[1]);
                if (dist <= 100) { // 100 meters threshold
                   inRedZone = true;
                   break;
                }
             }
          }
          if (inRedZone) break;
        }

        setIsInRedZone(prev => {
          if (!prev && inRedZone) console.log("Detected Red Zone Entry");
          return inRedZone;
        });
        
        // Simulate syncing location to backend if sharing is enabled
        if (shareLocation) {
          syncLocationToServer(newLocation);
        }
      },
      (error) => {
        console.error('Error watching location:', error);
        // If we get a permission denied error while tracking, update status
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermissionStatus('denied');
          stopTracking();
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  }, [watchId, stopTracking, shareLocation]);

  const syncLocationToServer = (location) => {
    const userStr = localStorage.getItem('user');
    let user = { id: 'anonymous' };
    try {
      if (userStr && userStr !== 'undefined') {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      user = { id: 'anonymous' };
    }
    
    const payload = {
      userId: user.id || 'anonymous',
      userName: user.name || 'Anonymous',
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date().toISOString()
    };
    
    // Use Socket.io to sync location in real-time
    socket.emit('updateLocation', payload);
    console.log("📡 Synced location via socket:", payload);
  };

  const reportHazard = useCallback((hazardData) => {
    const userStr = localStorage.getItem('user');
    let user = { id: null, name: 'Anonymous' };
    try {
      if (userStr && userStr !== 'undefined') {
        user = JSON.parse(userStr);
      }
    } catch (e) {}

    const fullHazardData = {
      ...hazardData,
      reportedBy: user.id,
      reportedByName: user.name,
      timestamp: new Date().toISOString()
    };

    socket.emit('reportHazard', fullHazardData);
    console.log("⚠️ Emitted hazard report:", fullHazardData);
  }, []);

  const toggleLocationSharing = useCallback(() => {
    setShareLocation(prev => {
      const newState = !prev;
      if (newState && locationPermissionStatus === 'granted' && !isTracking) {
        startTracking();
      }
      return newState;
    });
  }, [locationPermissionStatus, isTracking, startTracking]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleAllowLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser');
      setLocationPermissionStatus('denied');
      setShowPermissionModal(false);
      return;
    }

    // Try to get position to trigger browser prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermissionStatus('granted');
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setShowPermissionModal(false);
        startTracking();
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermissionStatus('denied');
        }
        // Still keep modal open to show error state if denied, or close depending on UX
        // For our flow, we'll keep it open to show the error message inside the modal
      },
      { enableHighAccuracy: true }
    );
  }, [startTracking]);

  const handleDenyLocation = useCallback(() => {
    // If user explicitly clicks "Not Now", we can just hide the modal 
    // without permanently setting 'denied' which is reserved for browser-level denial
    // but if we want to track it, we could set it to something else.
    // We will leave it as 'pending' but just close the modal.
    setShowPermissionModal(false);
  }, []);

  const requestLocationPermission = useCallback(() => {
    if (locationPermissionStatus === 'granted') {
      // Already granted, just start tracking if not already
      if (!isTracking) {
        startTracking();
      }
    } else {
      // Show custom modal
      setShowPermissionModal(true);
    }
  }, [locationPermissionStatus, isTracking, startTracking]);

    const getContacts = () => {
      const savedContacts = localStorage.getItem('emergencyContacts');
      let personalContacts = [];
      if (savedContacts) {
        try {
          personalContacts = JSON.parse(savedContacts);
        } catch (e) {
          console.error('Error parsing contacts');
        }
      }
      return [
        { name: 'Police', phone: '100' },
        { name: 'Hospital', phone: '108' },
        ...personalContacts
      ];
    };

    return (
      <SafetyContext.Provider
        value={{
          locationPermissionStatus,
          currentLocation,
          isTracking,
          showPermissionModal,
          requestLocationPermission,
          handleAllowLocation,
          handleDenyLocation,
          startTracking,
          stopTracking,
          shareLocation,
          toggleLocationSharing,
          activeUsers,
          isInRedZone,
          showSOSWarning,
          sosTriggered,
          triggerSOS,
          resetSOS,
          simulateRedZoneEntry,
          emergencyContacts: getContacts(),
          reportedHazards,
          reportHazard,
          liveActiveUsersCount
        }}
      >
      {children}
    </SafetyContext.Provider>
  );
};
