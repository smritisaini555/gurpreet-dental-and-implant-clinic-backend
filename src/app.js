const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointment.routes');
const FRONTEND_URL = 'https://gurpreet-dental-and-implant-clinic.onrender.com';

const app = express();

// --- Middleware ---
app.use(cors({
    origin: FRONTEND_URL, 
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json()); 

// --- API Routes ---
// Mount all routes under the /api prefix
app.use('/api', appointmentRoutes); 

// Fallback for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Endpoint not found." });
});

module.exports = app;