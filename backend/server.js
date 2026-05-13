require("dotenv").config()
const express = require('express');

const cors = require('cors'); 
const cookieParser = require('cookie-parser');

const connectDb = require("./config/db.js")

const authRouter = require('./router/authRouter');
const placeRouter = require('./router/placeRouter');
const adminRouter = require('./router/adminRouter');
const weatherRouter = require('./router/weatherRouter');

const http = require('http');
const { Server } = require('socket.io');
const Hazard = require('./models/hazard');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());


app.use('/api/auth/', authRouter)


app.use('/api/places', placeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/weather', weatherRouter);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Socket.io Logic
let activeUsersCount = 0;

io.on('connection', (socket) => {
  activeUsersCount++;
  console.log(`📡 New client connected. Active: ${activeUsersCount}`);
  
  // Send current stats to the newly connected admin dashboard
  io.emit('activeUsersUpdate', activeUsersCount);

  // Handle location updates from users
  socket.on('updateLocation', (data) => {
    // Broadcast location to admins or other relevant clients
    // In a real app, you might room-based broadcasting
    socket.broadcast.emit('userLocationUpdate', data);
  });

  // Handle hazard reporting
  socket.on('reportHazard', async (hazardData) => {
    try {
      const newHazard = new Hazard(hazardData);
      await newHazard.save();
      
      // Broadcast the new hazard to all connected clients
      io.emit('hazardReported', newHazard);
      console.log(`⚠️ Hazard reported: ${hazardData.type}`);
    } catch (err) {
      console.error('Error saving hazard:', err);
    }
  });

  socket.on('disconnect', () => {
    activeUsersCount--;
    console.log(`📡 Client disconnected. Active: ${activeUsersCount}`);
    io.emit('activeUsersUpdate', activeUsersCount);
  });
});

connectDb(process.env.MONGO_URI)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

