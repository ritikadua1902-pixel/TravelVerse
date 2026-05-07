const Users = require('../models/users');
const Destination = require('../models/place');
const ImageKit = require('imagekit');
const crypto = require('crypto');

const imagekit = new ImageKit({
  publicKey: process.env.ImageKitPublicKey,
  privateKey: process.env.ImageKitPrivateKey,
  urlEndpoint: process.env.imgKitURL
});

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await Users.countDocuments();
    const totalAdmins = await Users.countDocuments({ role: 'admin' });
    const totalPlaces = await Destination.countDocuments();
    const recentUsers = await Users.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentPlaces = await Destination.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalPlaces,
      recentUsers,
      recentPlaces
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin stats', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await Users.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Users.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

// Place Management
exports.createPlace = async (req, res) => {
  try {
    const { name, description, baseCoordinates, redZones, hiddenGems, popularSpots } = req.body;
    let imageUrl = '';

    if (req.file) {
      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: `place_${Date.now()}_${req.file.originalname}`,
        folder: '/tour_himachal/places'
      });
      imageUrl = response.url;
    }

    let parsedCoordinates = [];
    try {
        parsedCoordinates = JSON.parse(baseCoordinates);
    } catch(e) {
        parsedCoordinates = [31.1048, 77.1666]; // default
    }

    let parsedRedZones = [];
    let parsedHiddenGems = [];
    let parsedPopularSpots = [];
    
    try { if (redZones) parsedRedZones = JSON.parse(redZones); } catch(e) {}
    try { if (hiddenGems) parsedHiddenGems = JSON.parse(hiddenGems); } catch(e) {}
    try { if (popularSpots) parsedPopularSpots = JSON.parse(popularSpots); } catch(e) {}

    const newPlace = new Destination({
      name,
      description,
      image: imageUrl,
      baseCoordinates: parsedCoordinates,
      redZones: parsedRedZones,
      hiddenGems: parsedHiddenGems,
      popularSpots: parsedPopularSpots
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(500).json({ message: 'Error creating place', error: err.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await Destination.findByIdAndDelete(id);
    
    if (!deletedPlace) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting place', error: err.message });
  }
};
