const mongoose = require('mongoose');

let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        const db = await mongoose.connect(MONGO_URI);

        isConnected = db.connections[0].readyState === 1;

        console.log('✅ New MongoDB connection established!');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err; 
    }
};

module.exports = connectDB;