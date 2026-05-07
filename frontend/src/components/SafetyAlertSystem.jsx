import React, { useEffect, useState, useContext } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import axios from 'axios';
import { SafetyContext } from '../context/SafetyContext';
import { API_BASE_URL } from '../config';

// Define a threshold in degrees (approx 500 meters)
const ALERT_RADIUS = 0.005;

const SafetyAlertSystem = () => {
  const { currentLocation } = useContext(SafetyContext);
  const [places, setPlaces] = useState([]);
  const [alertHistory, setAlertHistory] = useState(new Set());

  useEffect(() => {
    // Fetch all places to get red zones
    axios.get(`${API_BASE_URL}/api/places`)
      .then(res => setPlaces(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!currentLocation || places.length === 0) return;

    const userLat = currentLocation.lat || currentLocation.latitude;
    const userLng = currentLocation.lng || currentLocation.longitude;

    places.forEach(place => {
      place.redZones?.forEach(zone => {
        if (!zone.coordinates || !Array.isArray(zone.coordinates)) return;
        
        const [zLat, zLng] = zone.coordinates;
        // Simple Euclidean distance for rough approximation
        const distance = Math.sqrt(Math.pow(userLat - zLat, 2) + Math.pow(userLng - zLng, 2));

        if (distance < ALERT_RADIUS) {
          const alertKey = `${place._id || place.id}-${zone._id || zone.id}`;
          
          if (!alertHistory.has(alertKey)) {
            // User entered a new red zone
            triggerAlert(zone, place.name);
            setAlertHistory(prev => new Set(prev).add(alertKey));
          }
        }
      });
    });
  }, [currentLocation, places, alertHistory]);

  const triggerAlert = (zone, placeName) => {
    // 1. UI Toast
    toast.error(
      <div>
        <strong>DANGER ZONE ENTERED</strong><br/>
        You have entered a red zone: {zone.name} in {placeName}.<br/>
        {zone.description}
      </div>,
      { duration: 8000 }
    );

    // 2. EmailJS Alert
    const userStr = localStorage.getItem('user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch(e) {}

    if (user?.email) {
      const templateParams = {
        to_email: user.email,
        to_name: user.name,
        zone_name: zone.name,
        place_name: placeName,
        description: zone.description,
        coordinates: `${zone.coordinates[0]}, ${zone.coordinates[1]}`
      };

      // Replace these with actual EmailJS keys from .env or config
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';

      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then(() => console.log('Safety email sent to', user.email))
        .catch(err => console.error('EmailJS Error:', err));
    }
  };

  return null; // This component has no UI, it runs in the background
};

export default SafetyAlertSystem;
