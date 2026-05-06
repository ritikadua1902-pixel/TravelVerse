import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Phone } from 'lucide-react';

const EmergencyContactsModal = ({ isOpen, onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const defaultContacts = [
    { name: 'Police', phone: '+91100' },
    { name: 'Hospital', phone: '+91108' }
  ];

  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error('Error parsing contacts');
      }
    }
  }, []);

  const saveContacts = (newContacts) => {
    setContacts(newContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact = { name: newName.trim(), phone: newPhone.trim() };
    saveContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
  };

  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    saveContacts(newContacts);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', width: '90%', maxWidth: '400px',
        padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, color: '#1f2937' }}>
          <Phone size={24} color="#3b82f6" />
          Emergency Contacts
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          These contacts will be notified automatically during an SOS event.
        </p>

        {/* Default Contacts */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>Emergency Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {defaultContacts.map((contact, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', padding: '0.75rem',
                background: '#f3f4f6', borderRadius: '8px', alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>{contact.name}</span>
                <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>{contact.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Contacts */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#374151', marginBottom: '0.5rem' }}>Personal Contacts</h3>
          
          <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
            <input
              type="text"
              placeholder="Phone (e.g. +91...)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              style={{ flex: 1.5, padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
            <button type="submit" style={{
              background: '#3b82f6', color: 'white', border: 'none',
              borderRadius: '6px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}>
              <Plus size={20} />
            </button>
          </form>

          {contacts.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
              No personal contacts added yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
              {contacts.map((contact, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '0.75rem',
                  background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>{contact.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{contact.phone}</div>
                  </div>
                  <button onClick={() => handleDeleteContact(idx)} style={{
                    background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem'
                  }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '0.75rem', background: '#f3f4f6', color: '#374151',
          border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EmergencyContactsModal;
