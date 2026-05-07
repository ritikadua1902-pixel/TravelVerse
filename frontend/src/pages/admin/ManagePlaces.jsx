import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  // Complex States
  const [redZones, setRedZones] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/places`);
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this place?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/place/${id}`, { withCredentials: true });
      fetchPlaces();
    } catch (err) {
      alert('Error deleting place');
    }
  };

  const addSubItem = (type) => {
    const newItem = { id: Date.now().toString(), name: '', description: '', coordinates: [0, 0] };
    if (type === 'redZone') setRedZones([...redZones, newItem]);
    if (type === 'hiddenGem') setHiddenGems([...hiddenGems, newItem]);
  };

  const updateSubItem = (type, id, field, value) => {
    const updateList = (list) => list.map(item => item.id === id ? { ...item, [field]: value } : item);
    if (type === 'redZone') setRedZones(updateList(redZones));
    if (type === 'hiddenGem') setHiddenGems(updateList(hiddenGems));
  };

  const updateSubItemCoord = (type, id, index, value) => {
    const updateList = (list) => list.map(item => {
      if (item.id === id) {
        const newCoords = [...item.coordinates];
        newCoords[index] = parseFloat(value) || 0;
        return { ...item, coordinates: newCoords };
      }
      return item;
    });
    if (type === 'redZone') setRedZones(updateList(redZones));
    if (type === 'hiddenGem') setHiddenGems(updateList(hiddenGems));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('baseCoordinates', JSON.stringify([parseFloat(lat), parseFloat(lng)]));
    formData.append('redZones', JSON.stringify(redZones));
    formData.append('hiddenGems', JSON.stringify(hiddenGems));
    if (image) formData.append('image', image);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/places`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowForm(false);
      fetchPlaces();
      // Reset form
      setName(''); setDescription(''); setLat(''); setLng(''); setRedZones([]); setHiddenGems([]);
    } catch (err) {
      alert('Error creating place');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Places</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add New Place'}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Place</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Place Name" className="bg-gray-700 p-3 rounded" value={name} onChange={e => setName(e.target.value)} />
                <input type="file" accept="image/*" className="bg-gray-700 p-3 rounded" onChange={e => setImage(e.target.files[0])} />
              </div>
              <textarea placeholder="Description" className="bg-gray-700 p-3 rounded w-full h-24" value={description} onChange={e => setDescription(e.target.value)} />
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="any" placeholder="Base Latitude (e.g. 31.1048)" className="bg-gray-700 p-3 rounded" value={lat} onChange={e => setLat(e.target.value)} />
                <input required type="number" step="any" placeholder="Base Longitude (e.g. 77.1734)" className="bg-gray-700 p-3 rounded" value={lng} onChange={e => setLng(e.target.value)} />
              </div>

              {/* Red Zones Section */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-red-400">Red Zones</h3>
                  <button type="button" onClick={() => addSubItem('redZone')} className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">+ Add Red Zone</button>
                </div>
                {redZones.map((rz, i) => (
                  <div key={rz.id} className="grid grid-cols-4 gap-2 mb-2">
                    <input type="text" placeholder="Name" className="bg-gray-700 p-2 rounded" value={rz.name} onChange={e => updateSubItem('redZone', rz.id, 'name', e.target.value)} />
                    <input type="text" placeholder="Desc" className="bg-gray-700 p-2 rounded" value={rz.description} onChange={e => updateSubItem('redZone', rz.id, 'description', e.target.value)} />
                    <input type="number" step="any" placeholder="Lat" className="bg-gray-700 p-2 rounded" value={rz.coordinates[0]} onChange={e => updateSubItemCoord('redZone', rz.id, 0, e.target.value)} />
                    <input type="number" step="any" placeholder="Lng" className="bg-gray-700 p-2 rounded" value={rz.coordinates[1]} onChange={e => updateSubItemCoord('redZone', rz.id, 1, e.target.value)} />
                  </div>
                ))}
              </div>

              {/* Hidden Gems Section */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-yellow-400">Hidden Gems</h3>
                  <button type="button" onClick={() => addSubItem('hiddenGem')} className="text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">+ Add Gem</button>
                </div>
                {hiddenGems.map((hg, i) => (
                  <div key={hg.id} className="grid grid-cols-4 gap-2 mb-2">
                    <input type="text" placeholder="Name" className="bg-gray-700 p-2 rounded" value={hg.name} onChange={e => updateSubItem('hiddenGem', hg.id, 'name', e.target.value)} />
                    <input type="text" placeholder="Desc" className="bg-gray-700 p-2 rounded" value={hg.description} onChange={e => updateSubItem('hiddenGem', hg.id, 'description', e.target.value)} />
                    <input type="number" step="any" placeholder="Lat" className="bg-gray-700 p-2 rounded" value={hg.coordinates[0]} onChange={e => updateSubItemCoord('hiddenGem', hg.id, 0, e.target.value)} />
                    <input type="number" step="any" placeholder="Lng" className="bg-gray-700 p-2 rounded" value={hg.coordinates[1]} onChange={e => updateSubItemCoord('hiddenGem', hg.id, 1, e.target.value)} />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 py-3 rounded mt-6 font-bold">Save Place</button>
            </form>
          </div>
        )}

        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(place => (
              <div key={place._id} className="bg-gray-800 rounded-lg overflow-hidden shadow border border-gray-700">
                {place.image && <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{place.description}</p>
                  <p className="text-xs text-gray-500 mb-4">Coords: {place.baseCoordinates[0]}, {place.baseCoordinates[1]}</p>
                  <button onClick={() => handleDelete(place._id)} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm">Delete Place</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePlaces;
