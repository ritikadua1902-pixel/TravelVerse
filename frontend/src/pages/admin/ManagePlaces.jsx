import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Trash2, Plus, Sparkles, AlertTriangle, X, Image as ImageIcon, Pencil,
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../components/admin/AdminSidebar';

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [redZones, setRedZones] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);

  // Edit mode state
  const [editingPlace, setEditingPlace] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editRedZones, setEditRedZones] = useState([]);
  const [editHiddenGems, setEditHiddenGems] = useState([]);

  useEffect(() => { fetchPlaces(); }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/places`);
      setPlaces(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this place?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/place/${id}`, { withCredentials: true });
      fetchPlaces();
    } catch (err) { alert('Error deleting place'); }
  };

  // --- Create form sub-item helpers ---
  const addSubItem = (type) => {
    const item = { id: Date.now().toString(), name: '', description: '', coordinates: [0, 0] };
    if (type === 'redZone') setRedZones([...redZones, item]);
    if (type === 'hiddenGem') setHiddenGems([...hiddenGems, item]);
  };

  const removeSubItem = (type, id) => {
    if (type === 'redZone') setRedZones(redZones.filter(i => i.id !== id));
    if (type === 'hiddenGem') setHiddenGems(hiddenGems.filter(i => i.id !== id));
  };

  const updateSubItem = (type, id, field, value) => {
    const fn = (list) => list.map((i) => i.id === id ? { ...i, [field]: value } : i);
    if (type === 'redZone') setRedZones(fn(redZones));
    if (type === 'hiddenGem') setHiddenGems(fn(hiddenGems));
  };

  const updateSubItemCoord = (type, id, index, value) => {
    const fn = (list) => list.map((i) => {
      if (i.id === id) { const c = [...i.coordinates]; c[index] = parseFloat(value) || 0; return { ...i, coordinates: c }; }
      return i;
    });
    if (type === 'redZone') setRedZones(fn(redZones));
    if (type === 'hiddenGem') setHiddenGems(fn(hiddenGems));
  };

  // --- Edit form sub-item helpers ---
  const addEditSubItem = (type) => {
    const item = { id: Date.now().toString(), name: '', description: '', coordinates: [0, 0] };
    if (type === 'redZone') setEditRedZones([...editRedZones, item]);
    if (type === 'hiddenGem') setEditHiddenGems([...editHiddenGems, item]);
  };

  const removeEditSubItem = (type, id) => {
    if (type === 'redZone') setEditRedZones(editRedZones.filter(i => (i.id || i._id) !== id));
    if (type === 'hiddenGem') setEditHiddenGems(editHiddenGems.filter(i => (i.id || i._id) !== id));
  };

  const updateEditSubItem = (type, id, field, value) => {
    const fn = (list) => list.map((i) => (i.id || i._id) === id ? { ...i, [field]: value } : i);
    if (type === 'redZone') setEditRedZones(fn(editRedZones));
    if (type === 'hiddenGem') setEditHiddenGems(fn(editHiddenGems));
  };

  const updateEditSubItemCoord = (type, id, index, value) => {
    const fn = (list) => list.map((i) => {
      if ((i.id || i._id) === id) { const c = [...i.coordinates]; c[index] = parseFloat(value) || 0; return { ...i, coordinates: c }; }
      return i;
    });
    if (type === 'redZone') setEditRedZones(fn(editRedZones));
    if (type === 'hiddenGem') setEditHiddenGems(fn(editHiddenGems));
  };

  // --- Create submit ---
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
        withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowForm(false); fetchPlaces();
      setName(''); setDescription(''); setLat(''); setLng(''); setRedZones([]); setHiddenGems([]);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert('Error creating place: ' + msg);
      console.error('Create place error:', err.response?.data || err);
    }
  };

  // --- Open edit modal ---
  const openEditForm = (place) => {
    setEditingPlace(place);
    setEditName(place.name || '');
    setEditDescription(place.description || '');
    setEditImage(null);
    setEditLat(place.baseCoordinates?.[0]?.toString() || '');
    setEditLng(place.baseCoordinates?.[1]?.toString() || '');
    setEditRedZones(
      (place.redZones || []).map(rz => ({
        id: rz._id || rz.id || Date.now().toString(),
        name: rz.name || '',
        description: rz.description || '',
        coordinates: rz.coordinates || [0, 0],
      }))
    );
    setEditHiddenGems(
      (place.hiddenGems || []).map(hg => ({
        id: hg._id || hg.id || Date.now().toString(),
        name: hg.name || '',
        description: hg.description || '',
        coordinates: hg.coordinates || [0, 0],
      }))
    );
    setShowEditForm(true);
  };

  // --- Edit submit ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('description', editDescription);
    formData.append('baseCoordinates', JSON.stringify([parseFloat(editLat), parseFloat(editLng)]));
    formData.append('redZones', JSON.stringify(editRedZones));
    formData.append('hiddenGems', JSON.stringify(editHiddenGems));
    if (editImage) formData.append('image', editImage);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/place/${editingPlace._id}`, formData, {
        withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowEditForm(false);
      setEditingPlace(null);
      fetchPlaces();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert('Error updating place: ' + msg);
      console.error('Update place error:', err.response?.data || err);
    }
  };

  const inputCls = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200";

  // --- Sub-item form renderer (reusable for create & edit) ---
  const renderSubItems = (type, items, { add, remove, update, updateCoord }) => {
    const isRed = type === 'redZone';
    const color = isRed ? 'red' : 'amber';
    const label = isRed ? 'Red Zones' : 'Hidden Gems';
    const btnLabel = isRed ? '+ Add Zone' : '+ Add Gem';
    const Icon = isRed ? AlertTriangle : Sparkles;

    return (
      <div className="border-t border-white/[0.06] pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-semibold text-${color}-400 flex items-center gap-2`}><Icon size={16} /> {label}</h3>
          <button type="button" onClick={() => add(type)}
            className={`bg-${color}-500/10 hover:bg-${color}-500/20 border border-${color}-500/15 px-3 py-1.5 rounded-lg text-xs font-medium text-${color}-400 transition-colors`}>
            {btnLabel}
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div key={itemId} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 items-center">
                <input type="text" placeholder="Name" className={inputCls} value={item.name} onChange={(e) => update(type, itemId, 'name', e.target.value)} />
                <input type="text" placeholder="Description" className={inputCls} value={item.description} onChange={(e) => update(type, itemId, 'description', e.target.value)} />
                <input type="number" step="any" placeholder="Lat" className={inputCls} value={item.coordinates[0]} onChange={(e) => updateCoord(type, itemId, 0, e.target.value)} />
                <input type="number" step="any" placeholder="Lng" className={inputCls} value={item.coordinates[1]} onChange={(e) => updateCoord(type, itemId, 1, e.target.value)} />
                <button type="button" onClick={() => remove(type, itemId)} className={`text-${color}-400/60 hover:text-${color}-400 transition-colors justify-self-start xl:justify-self-center`}><X size={16} /></button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 border-[3px] border-emerald-500/30 border-t-emerald-500 rounded-full" />
          <p className="text-gray-500 text-sm font-medium animate-pulse">Loading places...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <AdminSidebar />

      <main className="min-h-screen relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 mt-16 lg:mt-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Place Management</p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Manage Places
              </h1>
              <p className="text-gray-500 mt-2 text-sm">Add and manage tourist places, hidden gems and red zones.</p>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 w-fit text-sm">
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Close Form' : 'Add New Place'}
            </motion.button>
          </motion.div>

          {/* CREATE FORM */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20 backdrop-blur-sm mb-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-400" /> New Place
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Place Name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
                    <label className={`${inputCls} flex items-center gap-3 cursor-pointer text-gray-500`}>
                      <ImageIcon size={16} className="flex-shrink-0" />
                      <span className="truncate">{image ? image.name : 'Choose image...'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                  </div>
                  <textarea placeholder="Description" className={`${inputCls} h-28 resize-none`} value={description} onChange={(e) => setDescription(e.target.value)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="number" step="any" placeholder="Latitude" className={inputCls} value={lat} onChange={(e) => setLat(e.target.value)} />
                    <input required type="number" step="any" placeholder="Longitude" className={inputCls} value={lng} onChange={(e) => setLng(e.target.value)} />
                  </div>

                  {renderSubItems('redZone', redZones, { add: addSubItem, remove: removeSubItem, update: updateSubItem, updateCoord: updateSubItemCoord })}
                  {renderSubItems('hiddenGem', hiddenGems, { add: addSubItem, remove: removeSubItem, update: updateSubItem, updateCoord: updateSubItemCoord })}

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20">
                    Save Place
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EDIT MODAL */}
          <AnimatePresence>
            {showEditForm && editingPlace && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setShowEditForm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="bg-[#0b1120] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Pencil size={18} className="text-emerald-400" /> Edit Place
                    </h2>
                    <button onClick={() => setShowEditForm(false)}
                      className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Current image preview */}
                  {editingPlace.image && !editImage && (
                    <div className="mb-5 rounded-xl overflow-hidden border border-white/[0.06]">
                      <img src={editingPlace.image} alt={editingPlace.name} className="w-full h-40 object-cover opacity-70" />
                      <p className="text-[10px] text-gray-600 px-3 py-1.5 bg-white/[0.02]">Current image — upload a new file below to replace</p>
                    </div>
                  )}

                  <form onSubmit={handleEditSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Place Name" className={inputCls} value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <label className={`${inputCls} flex items-center gap-3 cursor-pointer text-gray-500`}>
                        <ImageIcon size={16} className="flex-shrink-0" />
                        <span className="truncate">{editImage ? editImage.name : 'Replace image (optional)...'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditImage(e.target.files[0])} />
                      </label>
                    </div>
                    <textarea placeholder="Description" className={`${inputCls} h-28 resize-none`} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="number" step="any" placeholder="Latitude" className={inputCls} value={editLat} onChange={(e) => setEditLat(e.target.value)} />
                      <input required type="number" step="any" placeholder="Longitude" className={inputCls} value={editLng} onChange={(e) => setEditLng(e.target.value)} />
                    </div>

                    {renderSubItems('redZone', editRedZones, { add: addEditSubItem, remove: removeEditSubItem, update: updateEditSubItem, updateCoord: updateEditSubItemCoord })}
                    {renderSubItems('hiddenGem', editHiddenGems, { add: addEditSubItem, remove: removeEditSubItem, update: updateEditSubItem, updateCoord: updateEditSubItemCoord })}

                    <div className="flex gap-3 pt-2">
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20">
                        Update Place
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="button"
                        onClick={() => setShowEditForm(false)}
                        className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors">
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PLACES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-7">
            {places.map((place, index) => (
              <motion.div key={place._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl shadow-black/20 backdrop-blur-sm group">
                {place.image && (
                  <div className="overflow-hidden relative">
                    <img src={place.image} alt={place.name}
                      className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10">
                      <MapPin className="text-emerald-400" size={16} />
                    </div>
                    <h3 className="text-lg font-bold truncate">{place.name}</h3>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{place.description}</p>
                  <div className="bg-white/[0.03] rounded-xl p-3 mb-4 border border-white/[0.04]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Coordinates</p>
                    <p className="mt-1 text-xs text-gray-400 font-mono">{place.baseCoordinates[0]}, {place.baseCoordinates[1]}</p>
                  </div>

                  {/* Summary badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.redZones?.length > 0 && (
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/10">
                        {place.redZones.length} Red Zone{place.redZones.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {place.hiddenGems?.length > 0 && (
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/10">
                        {place.hiddenGems.length} Hidden Gem{place.hiddenGems.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => openEditForm(place)}
                      className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/15 py-2.5 rounded-xl flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium transition-colors">
                      <Pencil size={14} /> Edit
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(place._id)}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/15 border border-red-500/15 py-2.5 rounded-xl flex items-center justify-center gap-2 text-red-400 text-xs font-medium transition-colors">
                      <Trash2 size={14} /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {places.length === 0 && (
            <div className="text-center py-20">
              <MapPin size={40} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">No places added yet. Click "Add New Place" to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagePlaces;