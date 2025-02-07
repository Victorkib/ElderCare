import Medication from '../models/Medication.model.js';
import { isValidObjectId } from 'mongoose';

// Create a new medication
export const createMedication = async (req, res) => {
  try {
    const {
      elderlyId,
      name,
      dosage,
      frequency,
      timeSlots,
      refillDate,
      sideEffects,
      notes,
    } = req.body;

    // Validate required fields
    if (!elderlyId || !name || !dosage || !frequency || !timeSlots) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate elderlyId format
    if (!isValidObjectId(elderlyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid elderly ID format',
      });
    }

    // Create new medication
    const medication = new Medication({
      elderlyId,
      name,
      dosage,
      frequency,
      timeSlots,
      refillDate,
      sideEffects,
      notes,
    });

    // Save to database
    await medication.save();

    res.status(201).json({
      success: true,
      message: 'Medication created successfully',
      data: medication,
    });
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// Get all medications for a specific elderly user
export const getMedicationsByElderlyId = async (req, res) => {
  try {
    const { elderlyId } = req.params;

    // Validate elderlyId format
    if (!isValidObjectId(elderlyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid elderly ID format',
      });
    }

    // Find medications for the elderly user
    const medications = await Medication.find({ elderlyId });

    res.status(200).json({
      success: true,
      data: medications,
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};
