const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Landslide', 'Flood', 'Accident', 'Blocked Road', 'Other']
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if user is anonymous
  },
  reportedByName: {
    type: String,
    default: 'Anonymous'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hazard', hazardSchema);
