const mongoose = require("mongoose");

let isConnected = false;

const connectDb = async (url) => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("=> Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(url);
        isConnected = db.connections[0].readyState;
        console.log("=> New database connection established");
    } catch (err) {
        console.error("=> MongoDB connection error:", err.message);
        throw err; // Re-throw to prevent queries from buffering
    }
};

module.exports = connectDb;