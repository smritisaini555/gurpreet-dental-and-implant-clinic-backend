const mongoose = require('mongoose');

// Get URI from environment variables
const MONGO_URI = process.env.MONGO_URI; 

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;