import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDb } from './setupDb.js';
import { registerAuthRoutes } from './routes/authRoutes.js';
import { registerBarberRoutes } from './routes/barberRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

// Setup database connection
await setupDb();

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
registerAuthRoutes(app);
registerBarberRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`BarberX Admin Server running on port ${PORT}`);
});