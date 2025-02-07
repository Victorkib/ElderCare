// controllers/noteController.js
import Note from '../models/elderNotes.model.js';

// Get all notes for a specific elder
export const getNotes = async (req, res) => {
  try {
    const { elderId } = req.params;

    const notes = await Note.find({ elderId }).sort({ CreatedAt: -1 }).lean();

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No notes found for this elder',
      });
    }

    res.status(200).json({
      status: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error while fetching notes',
      error: error.message,
    });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId).lean();

    if (!note) {
      return res.status(404).json({
        status: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      status: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error while fetching note',
      error: error.message,
    });
  }
};

// Create a new note
export const addNote = async (req, res) => {
  try {
    const { elderId, content, type, priority, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Note content cannot be empty',
      });
    }

    const newNote = new Note({
      elderId,
      content: content.trim(),
      type,
      priority,
      tags: tags.map((tag) => tag.trim()),
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      status: true,
      message: 'Note created successfully',
      note: savedNote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to create note',
      error: error.message,
    });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const updates = req.body;

    if (updates.content && !updates.content.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Note content cannot be empty',
      });
    }

    const existingNote = await Note.findById(noteId);

    if (!existingNote) {
      return res.status(404).json({
        status: false,
        message: 'Note not found',
      });
    }

    // Apply updates
    if (updates.content) existingNote.content = updates.content.trim();
    if (updates.type) existingNote.type = updates.type;
    if (updates.priority) existingNote.priority = updates.priority;
    if (updates.tags) existingNote.tags = updates.tags.map((tag) => tag.trim());

    const updatedNote = await existingNote.save();

    res.status(200).json({
      status: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update note',
      error: error.message,
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({
        status: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete note',
      error: error.message,
    });
  }
};

// Search notes with filters
export const searchNotes = async (req, res) => {
  try {
    const { elderId } = req.params;
    const { searchTerm, type, priority } = req.query;

    let query = { elderId };

    if (searchTerm) {
      query.$or = [
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (type) query.type = type;
    if (priority) query.priority = priority;

    const notes = await Note.find(query).sort({ CreatedAt: -1 }).lean();

    res.status(200).json({
      status: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};
