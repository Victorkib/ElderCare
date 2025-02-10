import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEvents,
} from '../controllers/event.controller.js';

const router = express.Router();

// GET /api/events
router.get('/getAllEvents', getEvents);

// POST /api/events
router.post('/createEvent', createEvent);
router.delete('/deleteEvent/:id', deleteEvent);

export default router;
