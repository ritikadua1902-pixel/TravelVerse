import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, MapPin, Send } from 'lucide-react';
import { SafetyContext } from '../context/SafetyContext';
import toast from 'react-hot-toast';

const HazardReportModal = ({ isOpen, onClose }) => {
  const { currentLocation, reportHazard } = useContext(SafetyContext);
  const [type, setType] = useState('Landslide');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hazardTypes = [
    { name: 'Landslide', icon: '🏔️', color: 'text-amber-500' },
    { name: 'Flood', icon: '🌊', color: 'text-blue-500' },
    { name: 'Accident', icon: '🚗', color: 'text-red-500' },
    { name: 'Blocked Road', icon: '🚧', color: 'text-orange-500' },
    { name: 'Other', icon: '⚠️', color: 'text-gray-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentLocation) {
      toast.error('Location required to report a hazard');
      return;
    }

    setIsSubmitting(true);
    try {
      reportHazard({
        type,
        description,
        location: {
          lat: currentLocation.lat,
          lng: currentLocation.lng
        }
      });
      toast.success('Hazard reported successfully!');
      onClose();
      setDescription('');
    } catch (err) {
      toast.error('Failed to report hazard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Report Hazard</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Help others stay safe by reporting issues</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  Hazard Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {hazardTypes.map((h) => (
                    <button
                      key={h.name}
                      type="button"
                      onClick={() => setType(h.name)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200
                        ${type === h.name 
                          ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                          : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05]'}
                      `}
                    >
                      <span className="text-2xl">{h.icon}</span>
                      <span className="text-xs font-semibold">{h.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Small landslide blocking half the road near the bridge..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px] resize-none"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-xs text-blue-100/70 leading-relaxed">
                  <strong>Reporting at:</strong> {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Detecting...'}
                  {!currentLocation && <p className="text-amber-400 mt-1">Enable location to submit report.</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !currentLocation}
                className={`
                  w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${isSubmitting || !currentLocation
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-[0.98]'}
                `}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Submit Hazard Report
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HazardReportModal;
