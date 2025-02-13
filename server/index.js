/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import elderRoutes from './routes/elder.Routes.js';
import healthLog from './routes/healthLog.routes.js';
import elderNotesRoutes from './routes/elderNotes.routes.js';
import eventRoutes from './routes/event.routes.js';
import caregiversRoutes from './routes/caregiver.routes.js';

dotenv.config();

// API Routes

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(
  cors({
    origin: [process.env.DEV_URL],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(express.json()); // To handle JSON data
app.use(express.urlencoded({ extended: true })); // To handle form data
app.use(cookieParser());

// DB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Success db connection');
    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to db: ', err);
  });

// Serve the static files from the React app (after building it )
const __filename = fileURLToPath(import.meta.url); // Get the filename
const __dirname = path.dirname(__filename); // Get the directory name
app.use(express.static(path.join(__dirname, '../../dist')));

// API Routes (before handling frontend routes)
app.use('/api', authRoutes);
app.use('/api/elders', elderRoutes);
app.use('/api/elderHealthLog', healthLog);
app.use('/api/elderNotes', elderNotesRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/caregivers', caregiversRoutes);

// Handle any other routes and serve index.html (React's entry point)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});
