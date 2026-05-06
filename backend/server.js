require("dotenv").config()
const express = require('express');

const cors = require('cors'); 
const cookieParser = require('cookie-parser');

const connectDb = require("./config/db.js")

const authRouter = require('./router/authRouter');
const placeRouter = require('./router/placeRouter');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://travel-verse-omega.vercel.app'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());


app.use('/api/auth/', authRouter)


app.use('/api/places', placeRouter);

connectDb(process.env.MONGO_URI)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
