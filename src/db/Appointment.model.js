const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    // Store doctor ID as a string, e.g., 'gurpreet' or 'harmanjot'
    doctorId: {
        type: String,
        required: [true, 'Doctor ID is required.']
    },
    // Store date in ISO format for easy sorting and comparison
    date: {
        type: String, // Storing as YYYY-MM-DD string as currently done in frontend
        required: [true, 'Appointment date is required.']
    },
    // Store time as a string, e.g., '10:30 AM'
    time: {
        type: String,
        required: [true, 'Appointment time is required.']
    },
    patientInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound unique index to prevent double-booking the exact same slot
// MongoDB will enforce that no two documents can have the same doctorId, date, and time.
AppointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);