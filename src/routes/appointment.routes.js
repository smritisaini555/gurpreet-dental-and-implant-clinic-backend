const express = require('express');
const router = express.Router();
const Appointment = require('../db/Appointment.model'); 
const { sendAppointmentConfirmation } = require('../services/notification.service'); // 🚨 NEW: Import notification service

// --- Helper function for robust validation ---
const validateBookingFields = (body) => {
    const { doctorId, date, time, patientInfo } = body;
    if (!doctorId || !date || !time || !patientInfo || !patientInfo.name || !patientInfo.email) {
        return { 
            isValid: false, 
            message: "Missing required booking fields (doctorId, date, time, patientInfo.name, or patientInfo.email)." 
        };
    }
    return { isValid: true };
};


// ----------------------------------------------------------------------
// --- Endpoint 1: GET Booked Slots (Availability) ---
// GET /api/doctors/:id/availability?date=YYYY-MM-DD
// ----------------------------------------------------------------------
router.get('/doctors/:id/availability', async (req, res) => {
    const doctorId = req.params.id;
    const dateKey = req.query.date; 

    if (!doctorId || !dateKey) {
        return res.status(400).json({ message: "Missing doctor ID or date query parameter." });
    }

    try {
        // Find all appointments for the specified doctor and date using Mongoose
        const appointments = await Appointment.find({
            doctorId: doctorId,
            date: dateKey
        }).select('time -_id'); // Efficiently retrieves only the time string

        // Extract just the time strings into an array
        const bookedSlots = appointments.map(app => app.time);
        
        console.log(`[READ] Doctor ${doctorId} on ${dateKey}: ${bookedSlots.length} slots booked.`);

        res.json({
            doctorId: doctorId,
            date: dateKey,
            bookedSlots: bookedSlots,
        });

    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Failed to fetch availability due to a server error." });
    }
});


// ----------------------------------------------------------------------
// --- Endpoint 2: POST Book Appointment ---
// POST /api/appointments
// ----------------------------------------------------------------------
router.post('/appointments', async (req, res) => {
    const { doctorId, date, time, patientInfo } = req.body;

    // Use robust helper validation
    const validation = validateBookingFields(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ success: false, message: validation.message });
    }
    
    try {
        // 1. Create the new Mongoose document
        const newAppointment = new Appointment({
            doctorId,
            date,
            time,
            patientInfo: {
                name: patientInfo.name, 
                email: patientInfo.email
            }
        });

        // 2. Save to MongoDB. The unique index handles the conflict check.
        await newAppointment.save();
        
        // 3. 🚨 NEW STEP: Send Notifications after successful save
        // We pass req.body directly as it contains all required patientInfo, date, time, and doctorId fields.
        console.log(`[EMAIL] Starting email notification for ${patientInfo.email}...`);
        await sendAppointmentConfirmation(req.body); 
        console.log(`[EMAIL] Notification finished.`);

        console.log(`[WRITE] BOOKED! Doctor ${doctorId} at ${time} on ${date}.`);

        res.status(201).json({ 
            success: true, 
            message: "Appointment successfully booked and notifications triggered.", // Updated message
            // Return only essential details for security/size
            appointmentDetails: {
                doctorId: newAppointment.doctorId,
                date: newAppointment.date,
                time: newAppointment.time,
                patientName: newAppointment.patientInfo.name
            }
        });

    } catch (error) {
        // Handle MongoDB unique index error (code 11000 = E11000 duplicate key error)
        if (error.code === 11000) {
             console.log(`[CONFLICT] Booking failed for ${doctorId} on ${date} at ${time}. Slot already taken.`);
             return res.status(409).json({ 
                 success: false, 
                 message: "This slot was just taken. Please select a different time." 
             });
        }
        
        console.error("Error during booking:", error);
        res.status(500).json({ success: false, message: "Failed to book appointment due to a server error." });
    }
});

module.exports = router;