import express from 'express';
import {
  getCaregivers,
  addCaregiver,
  updateCaregiver,
  deleteCaregiver,
  updateCaregiverStatus,
  getSingleCaregiver,
} from '../controllers/caregiver.controller.js';

const router = express.Router();

// Get all caregivers
router.get('/', getCaregivers);

// Get single caregivers
router.get('/getSingle/:caregiverId', getSingleCaregiver);

// Add a new caregiver
router.post('/', addCaregiver);

// Update a caregiver
router.put('/:id', updateCaregiver);

// Delete a caregiver
router.delete('/:id', deleteCaregiver);

// Update caregiver status
router.patch('/:id/status', updateCaregiverStatus);

export default router;
