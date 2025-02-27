// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());

// Connect to the database
connectDB()
    .then(() => {
        // Routes
        app.use('/api/users', userRoutes);

        app.get('/', (req, res) => {
            res.send('API is running...');
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
    });
