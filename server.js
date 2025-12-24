require('dotenv').config();
const app = require('./src/app'); 
const connectDB = require('./src/db/connection'); 

const PORT = process.env.PORT || 3001; 

connectDB();

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Booking API running at http://localhost:${PORT}`);
    });
}

module.exports = app;