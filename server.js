const app = require('./src/app');

const PORT = 3001;

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Mock Booking API running at http://localhost:${PORT}`);
    console.log('Use Ctrl+C to stop the server.');
});