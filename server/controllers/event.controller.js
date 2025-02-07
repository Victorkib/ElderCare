import Event from '../models/event.model.js';

import { validationResult } from 'express-validator';

// Fetch all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate({
      path: 'elderIds',
      select: '_id firstName lastName',
    });
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching events', error: error.message });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating event', error: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};
