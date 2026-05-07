const mongoose = require("mongoose");

let isConnected = false;

const connectDb = async (url) => {

    try {
         await mongoose.connect(url)
        console.log(" MongoDB connected successfully");
    } catch (err) {
        console.error("=> MongoDB connection error:", err.message);
        throw err;
    }
};

module.exports = connectDb;