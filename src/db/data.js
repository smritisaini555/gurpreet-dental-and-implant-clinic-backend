// --- MOCK DATABASE (our centralized data store) ---
const mockBookedData = {
    'gurpreet': {
        '2025-12-07': ['10:30 AM', '3:30 PM'], 
        '2025-12-08': ['10:00 AM', '1:00 PM', '5:00 PM'], 
    },
    'smriti': {
        '2025-12-07': ['12:00 PM', '6:30 PM'],
        '2025-12-09': ['11:30 AM', '3:00 PM', '6:00 PM'],
    },
};

// Export the data structure and helper functions to manipulate it
module.exports = {
    mockBookedData,

    getBookedSlots: (doctorId, dateKey) => {
        return mockBookedData[doctorId]?.[dateKey] || [];
    },

    bookSlot: (doctorId, date, time) => {
        // 1. Check if the slot is already booked (CRITICAL)
        const isAlreadyBooked = (mockBookedData[doctorId]?.[date] || []).includes(time);
        if (isAlreadyBooked) {
            return false; // Booking failed (already taken)
        }
        
        // 2. Mock Database WRITE (Update the mock data)
        if (!mockBookedData[doctorId]) {
            mockBookedData[doctorId] = {};
        }
        if (!mockBookedData[doctorId][date]) {
            mockBookedData[doctorId][date] = [];
        }
        mockBookedData[doctorId][date].push(time);
        
        return true; // Booking successful
    }
};