// Example route implementation
// routes/healthLogRoutes.js
import express from 'express';
import {
  createHealthLog,
  getHealthLogs,
  getHealthLogById,
  getBloodPressureTrends,
  getMedicationAdherence,
  getRecentAlerts,
  getPatientData,
} from '../controllers/healthLog.controller.js';

const router = express.Router();

router.post('/addHealthLog', createHealthLog);
router.get('/getAllHealthLogs', getHealthLogs);
router.get('/getSingleHealthLog/:id', getHealthLogById);

router.get('/:elderId/blood-pressure', getBloodPressureTrends);
router.get('/:elderId/medication-adherence', getMedicationAdherence);
router.get('/:elderId/recent-alerts', getRecentAlerts);

router.get('/getPatientData/:elderlyId', getPatientData);

export default router;
