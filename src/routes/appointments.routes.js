const express = require('express');
const router = express.Router();
const data = require('../db/data');

// --- Endpoint 1: GET Available Slots ---
// GET /api/doctors/:id/availability?date=YYYY-MM-DD
router.get('/doctors/:id/availability', (req, res) => {
    const doctorId = req.params.id;
    const dateKey = req.query.date;

    // Simulate Network Latency
    setTimeout(() => {
        const bookedSlots = data.getBookedSlots(doctorId, dateKey);
        
        console.log(`GET /availability: Doctor ${doctorId} on ${dateKey} => ${bookedSlots.length} slots booked.`);

        res.json({
            doctorId: doctorId,
            date: dateKey,
            bookedSlots: bookedSlots,
        });
    }, 500); // 500ms delay
});

// --- Endpoint 2: POST Book Appointment ---
// POST /api/appointments
router.post('/appointments', (req, res) => {
    const { doctorId, date, time, patientInfo } = req.body;

    // Basic validation
    if (!doctorId || !date || !time) {
        return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }
    
    // Simulate Network Latency and Database Write
    setTimeout(() => {
        const success = data.bookSlot(doctorId, date, time);
        
        if (!success) {
            // Conflict (409) if booking failed because the slot was already taken
            return res.status(409).json({ success: false, message: "Slot already taken." });
        }
        
        console.log(`POST /appointments: BOOKED! Doctor ${doctorId} at ${time} on ${date}.`);

        res.status(201).json({ 
            success: true, 
            message: "Appointment successfully booked and notification triggered.",
            appointmentDetails: { doctorId, date, time, patientInfo }
        });
    }, 800);
});

module.exports = router;