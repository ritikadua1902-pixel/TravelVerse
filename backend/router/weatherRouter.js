const express = require('express');
const weatherRouter = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to get weather by lat and lon
weatherRouter.get('/:lat/:lon', weatherController.getWeather);

module.exports = weatherRouter;
