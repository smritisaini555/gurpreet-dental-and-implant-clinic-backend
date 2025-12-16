const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointment.routes');

// Define ALL allowed origins (Frontend deployment and local development)
const ALLOWED_ORIGINS = [
    'http://localhost:3000', // For local React development
    'http://localhost:3001', // If the backend itself runs on 3001, add it (though usually unnecessary)
    'https://gurpreet-dental-and-implant-clinic.onrender.com', // Your backend's own URL, if accessing from the same service/domain
    'https://gurpreet-dental-and-implant-clinic-7z1xebkg7.vercel.app', // Vercel deployment URL
    // 'https://gurpreetdentalimplantcentre.com', // Primary custom domain
];

const app = express();

// --- CORS Configuration ---
const corsOptions = {
    // 💡 FIX: Use the array directly. The 'cors' package handles the origin checking logic internally.
    origin: ALLOWED_ORIGINS, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // It's good practice to list all HTTP methods you use
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); 

// --- API Routes ---
// Mount all routes under the /api prefix
app.use('/api', appointmentRoutes); 

// Fallback for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Endpoint not found." });
});

// 💡 Essential addition: General Error Handler
app.use((err, req, res, next) => {
    // Check if the error is specifically the CORS block error
    if (err.message === 'Not allowed by CORS') {
        // Send a 403 Forbidden specifically for CORS violation
        return res.status(403).json({ success: false, message: "CORS policy violation: Access from this origin is forbidden." });
    }
    // Handle all other server errors (like database connection issues, parsing errors, etc.)
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


module.exports = app;