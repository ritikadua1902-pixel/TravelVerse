const mongoose = require("mongoose");

let isConnected = false;

const connectDb = async (url) => {
    // Disable buffering so we get errors immediately instead of hanging for 10s
    mongoose.set('bufferCommands', false);
    mongoose.set('strictQuery', true);

    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4 // Use IPv4, which is often more stable
        });
        isConnected = db.connections[0].readyState;
        console.log("=> MongoDB connected successfully");
    } catch (err) {
        console.error("=> MongoDB connection error:", err.message);
        throw err;
    }
};

module.exports = connectDb;