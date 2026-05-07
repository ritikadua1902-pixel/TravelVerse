const mongoose = require("mongoose");


const coordinateSchema = {
  type: [Number],
  required: true
};


const redZoneSchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinates: coordinateSchema
});


const hiddenGemSchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinates: coordinateSchema
});


const popularSpotSchema = new mongoose.Schema({
  name: String,
  description: String,
  coordinates: coordinateSchema
});


const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  baseCoordinates: coordinateSchema,

  redZones: [redZoneSchema],
  hiddenGems: [hiddenGemSchema],
  popularSpots: [popularSpotSchema]

}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);