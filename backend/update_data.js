const fs = require('fs');
const path = require('path');

const placesPath = path.join(__dirname, 'data', 'places.json');
let places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));

const coords = {
  "2": [31.1048, 77.1734], // Shimla
  "7": [32.0998, 76.2691], // Kangra
  "8": [31.5892, 76.9318], // Mandi
  "9": [32.5534, 76.1258], // Chamba
  "10": [31.3300, 76.7599], // Bilaspur
  "11": [30.9084, 77.0999], // Solan
  "12": [31.4725, 76.2690], // Una
  "13": [31.6862, 76.5213], // Hamirpur
  "14": [30.7385, 77.3060], // Sirmaur
  "15": [31.6510, 78.4750], // Kinnaur
  "16": [32.3211, 77.8932], // Lahaul and Spiti
};

places = places.map((place) => {
  const base = coords[place.id] || [31.0, 77.0];
  const [lat, lng] = base;

  return {
    ...place,
    baseCoordinates: base,
    redZones: [
      {
        id: `rz_1_${place.id}`,
        name: "Steep Cliff Edge",
        description: "Dangerous area with frequent landslides.",
        coordinates: [lat + 0.005, lng - 0.005]
      },
      {
        id: `rz_2_${place.id}`,
        name: "Flash Flood Zone",
        description: "Low-lying river bank prone to sudden flooding.",
        coordinates: [lat - 0.008, lng + 0.004]
      }
    ],
    hiddenGems: [
      {
        id: `hg_1_${place.id}`,
        name: "Secret Waterfall",
        description: "A beautiful, secluded waterfall hidden in the forest.",
        coordinates: [lat - 0.005, lng - 0.006]
      },
      {
        id: `hg_2_${place.id}`,
        name: "Ancient Cave",
        description: "Historical meditation caves mostly untouched by tourism.",
        coordinates: [lat + 0.004, lng + 0.008]
      }
    ],
    popularSpots: [
      {
        id: `ps_1_${place.id}`,
        name: "Main Square",
        description: "The bustling center of the destination with shops and cafes.",
        coordinates: [lat + 0.001, lng + 0.002]
      },
      {
        id: `ps_2_${place.id}`,
        name: "Viewpoint Peak",
        description: "Famous panoramic viewpoint perfect for sunset photography.",
        coordinates: [lat + 0.002, lng - 0.003]
      }
    ]
  };
});

fs.writeFileSync(placesPath, JSON.stringify(places, null, 2));
console.log('Successfully updated places.json');
