const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

// 1. --- GLOBAL REQUEST LOGGER ---
// This will help you see if requests are reaching your server on Render
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

// 2. --- ALLOWED ORIGINS ---
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://gurpreet-dental-and-implant-clinic.onrender.com',
    'https://gurpreet-dental-and-implant-clinic.vercel.app',
];

// 3. --- CORS CONFIGURATION ---
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 4. --- API ROUTES ---
// Mount routes under /api prefix
app.use('/api', appointmentRoutes);

// 5. --- 404 FALLBACK ---
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Endpoint not found." });
});

// 6. --- GENERAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ 
            success: false, 
            message: "CORS policy violation: Access from this origin is forbidden." 
        });
    }
    
    console.error("SERVER ERROR STACK:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
    });
});

module.exports = app;