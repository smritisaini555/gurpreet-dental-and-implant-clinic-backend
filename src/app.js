const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointment.routes');

// Define ALL allowed origins (Frontend deployment and local development)
const ALLOWED_ORIGINS = [
    'http://localhost:3000', // <-- IMPORTANT: For local React development
    'https://gurpreet-dental-and-implant-clinic.onrender.com' // <-- Keep for any same-origin testing (e.g., if you are hosting the frontend and backend on the same service/URL)
    // Add your actual deployed frontend URL here, e.g., 'https://your-frontend-domain.com'
];

const app = express();

// --- Middleware ---
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, postman, or curl requests)
        if (!origin) return callback(null, true); 
        
        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log(`CORS Policy Blocked Origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
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