const Destination = require('../models/place');
const ImageKit = require('imagekit');
const crypto = require('crypto');
const imagekit = new ImageKit({
  publicKey: process.env.ImageKitPublicKey,
  privateKey: process.env.ImageKitPrivateKey,
  urlEndpoint: process.env.imgKitURL
});

exports.getPlaces = async (req, res) => {
  try {
    // If no places in DB, we could seed it, but for now we just return what's in MongoDB
    const places = await Destination.find();
    
    // To support the existing frontend that might expect old format:
    // If the DB is completely empty, you might want to return the JSON file data here.
    // For now, we will just return the DB data.
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching places data' });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { name, description, baseCoordinates } = req.body;
    let imageUrl = '';

    if (req.file) {
      const response = await imagekit.upload({
        file: req.file.buffer, // memory buffer from multer
        fileName: `place_${Date.now()}_${req.file.originalname}`,
        folder: '/tour_himachal/places'
      });
      imageUrl = response.url;
    }

    let parsedCoordinates = [];
    if (baseCoordinates) {
        try {
            parsedCoordinates = JSON.parse(baseCoordinates);
        } catch(e) {
            parsedCoordinates = [0, 0];
        }
    } else {
        parsedCoordinates = [31.1048, 77.1666]; // default Shimla coordinates if none provided
    }

    const newPlace = new Destination({
      name,
      description,
      image: imageUrl,
      baseCoordinates: parsedCoordinates,
      redZones: [],
      hiddenGems: [],
      popularSpots: []
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    console.error("Error creating place:", err);
    res.status(500).json({ message: 'Error creating place', error: err.message });
  }
};
