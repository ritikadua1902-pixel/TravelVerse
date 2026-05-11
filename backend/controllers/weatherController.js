const https = require('https');

exports.getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY || '86e680a37452d193d58f331904a43b9e';
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    console.log("🌦️ Fetching weather for:", { lat, lon });
    console.log("🔑 Using API Key (first 5 chars):", API_KEY.substring(0, 5) + "...");

    https.get(url, (apiRes) => {
      console.log("📡 OpenWeatherMap Response Status:", apiRes.statusCode);
      let data = '';
      apiRes.on('data', (chunk) => { data += chunk; });
      apiRes.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (apiRes.statusCode !== 200) {
            return res.status(apiRes.statusCode).json({ message: 'Error fetching weather', error: parsedData });
          }

          const weatherData = {
            temp: parsedData.main.temp,
            condition: parsedData.weather[0].main,
            description: parsedData.weather[0].description,
            icon: parsedData.weather[0].icon,
            humidity: parsedData.main.humidity,
            windSpeed: parsedData.wind.speed,
            city: parsedData.name
          };

          res.status(200).json(weatherData);
        } catch (e) {
          res.status(500).json({ message: 'Error parsing weather data' });
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ message: 'Error connecting to weather service' });
    });

  } catch (err) {
    console.error("Weather Fetch Error:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
