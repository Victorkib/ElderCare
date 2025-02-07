// routes/noteRoutes.js
import express from 'express';
import {
  addNote,
  deleteNote,
  getNoteById,
  getNotes,
  searchNotes,
  updateNote,
} from '../controllers/elderNotes.controller.js';

const router = express.Router();

// GET /elderHealthLog/notes/:elderId
router.get('/getNotes/:elderId', getNotes);

// GET /elderHealthLog/notes/single/:noteId
router.get('/notes/single/:noteId', getNoteById);

// POST /elderHealthLog/notes
router.post('/addNote', addNote);

// PUT /elderHealthLog/notes/:noteId
router.put('/updateNote/:noteId', updateNote);

// DELETE /elderHealthLog/notes/:noteId
router.delete('/deleteNote/:noteId', deleteNote);

// GET /elderHealthLog/notes/search/:elderId
router.get('/notes/search/:elderId', searchNotes);

export default router;
