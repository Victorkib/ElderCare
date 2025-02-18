// routes/elderRoutes.js
import express from 'express';
import {
  registerElder,
  getAllElders,
  getElder,
  updateElder,
  deleteElder,
  getElderMedicalInfo,
  updateEmergencyContacts,
  updateCarePreferences,
  getAllELderWithoutFiltering,
  getPatientProfile,
  getMedicalProfile,
  // getAllOrganizedElders,
  getAllEldersDetails,
  assignCaregiver,
  updateElderImage,
} from '../controllers/elder.controller.js';

const router = express.Router();

// Main CRUD routes
router.post('/register', registerElder);
router.get('/', getAllElders);
router.get('/getAllElders', getAllELderWithoutFiltering);
router.get('/getSingleElder/:id', getElder);
router.patch('/:id', updateElder);
router.patch('/updatePhoto/:id', updateElderImage);
router.delete('/:id', deleteElder);

// Specialized routes
router.get('/:id/medical', getElderMedicalInfo);
router.patch('/:id/emergency-contacts', updateEmergencyContacts);
router.patch('/:id/care-preferences', updateCarePreferences);

// routes for the elder data
router.get('/:elderId/profile', getPatientProfile);
router.get('/:elderId/medical-profile', getMedicalProfile);
router.get('/getEldersData/elders', getAllEldersDetails);

//route for editing assinged care giver to elder
router.patch('/assignCaregiver/:elderId', assignCaregiver);

export default router;
