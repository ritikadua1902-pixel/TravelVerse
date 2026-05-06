const express = require('express');
const placeRouter = express.Router();
const placeController = require('../controllers/placeController');
const upload = require('../middlewares/upload');

// Get all places
placeRouter.get('/', placeController.getPlaces);

// Create a new place with image upload
placeRouter.post('/', upload.single('image'), placeController.createPlace);

module.exports = placeRouter;
