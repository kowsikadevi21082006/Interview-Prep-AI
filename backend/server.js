require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const healthRoutes = require('./src/routes/healthRoutes');
const interviewRoutes = require('./src/routes/interviewRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route - Fixes "Not Found - /" error on deployment
app.get('/', (req, res) => {
    res.json({
        message: 'AI Interviewer API is running...',
        status: 'healthy',
        time: new Date().toISOString()
    });
});

// Routes
app.use('/api', healthRoutes);
app.use('/api/interview', interviewRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start the server if we're not in a serverless environment (like Vercel)
// or if we explicitly want to start the listener. 
// Vercel handles the listening part for us if we export the app.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

module.exports = app;
