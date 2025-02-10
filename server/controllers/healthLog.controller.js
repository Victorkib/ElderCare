// controllers/healthLogController.js
import HealthLog from '../models/healthLog.model.js';
import { isValidObjectId } from 'mongoose';
import Elder from '../models/elder.model.js';
import Medication from '../models/Medication.model.js';
import mongoose from 'mongoose';
import Event from '../models/event.model.js';

export const createHealthLog = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    const {
      elderlyId,
      bloodPressure,
      weight,
      heartRate,
      glucose,
      oxygen,
      temperature,
      painLevel,
      notes,
      medications, // Array of medication objects
      logDateTime,
    } = req.body;

    // Validate required fields
    if (!elderlyId || !logDateTime) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(400).json({
        success: false,
        error: 'Elderly ID and log date/time are required',
      });
    }

    // Validate elderlyId format
    if (!mongoose.isValidObjectId(elderlyId)) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(400).json({
        success: false,
        error: 'Invalid elderly ID format',
      });
    }

    // Check if the elderly user exists
    const elderly = await Elder.findById(elderlyId).session(session);
    if (!elderly) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(404).json({
        success: false,
        error: 'Elderly user not found',
      });
    }

    // Validate logDateTime
    const parsedLogDateTime = new Date(logDateTime);
    if (isNaN(parsedLogDateTime)) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(400).json({
        success: false,
        error: 'Invalid log date/time format',
      });
    }

    // Validate medications array (if provided)
    let medicationIds = [];
    if (medications && Array.isArray(medications)) {
      for (const med of medications) {
        if (
          !med.name ||
          !med.dosage ||
          !med.frequency ||
          !med.timeSlots ||
          !Array.isArray(med.timeSlots)
        ) {
          await session.abortTransaction(); // Abort the transaction
          session.endSession(); // End the session
          return res.status(400).json({
            success: false,
            error: 'Invalid medication data',
          });
        }

        // Create a new medication
        const newMedication = new Medication({
          elderlyId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          timeSlots: med.timeSlots,
          refillDate: med.refillDate,
          sideEffects: med.sideEffects,
          notes: med.notes,
        });

        // Save the medication to the database
        const savedMedication = await newMedication.save({ session });
        medicationIds.push(savedMedication._id); // Store the medication ID
      }
    }

    // Evaluate health status
    let healthStatus = 'Healthy';

    const [systolic, diastolic] = bloodPressure.split('/').map(Number);
    if (
      systolic < 90 ||
      systolic > 140 ||
      diastolic < 60 ||
      diastolic > 90 ||
      weight <= 0 ||
      heartRate < 60 ||
      heartRate > 100 ||
      (glucose && (glucose < 70 || glucose > 140)) ||
      (oxygen && oxygen < 95) ||
      (temperature && (temperature < 36.1 || temperature > 37.2)) ||
      (painLevel && painLevel > 7)
    ) {
      healthStatus = 'At Risk';
    }

    if (
      systolic < 70 ||
      systolic > 180 ||
      diastolic < 40 ||
      diastolic > 120 ||
      heartRate < 40 ||
      heartRate > 120 ||
      (glucose && (glucose < 50 || glucose > 200)) ||
      (oxygen && oxygen < 90) ||
      (temperature && (temperature < 35.5 || temperature > 38)) ||
      (painLevel && painLevel > 9)
    ) {
      healthStatus = 'Critical';
    }

    // Prepare new health log data
    const healthLog = new HealthLog({
      elderlyId,
      bloodPressure,
      weight,
      heartRate,
      glucose,
      oxygen,
      temperature,
      painLevel,
      notes,
      medications: medicationIds, // Array of medication IDs
      logDateTime: parsedLogDateTime,
      healthStatus,
    });

    // Save to database
    await healthLog.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Health log created successfully',
      data: healthLog,
    });
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error('Error creating health log:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};

export const getHealthLogs = async (req, res) => {
  try {
    // Fetch health logs with Elder populated and sorted by CreatedAt in descending order
    const healthLogs = await HealthLog.find({})
      .populate('elderlyId')
      .sort({ CreatedAt: -1 });

    // Group by elderlyId and keep only the most recent log for each elder
    const recentLogsByElder = Object.values(
      healthLogs.reduce((acc, log) => {
        if (!acc[log.elderlyId._id]) {
          acc[log.elderlyId._id] = log; // Store the most recent log for each elder
        }
        return acc;
      }, {})
    );

    res.status(200).json(recentLogsByElder);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health logs',
      error: error.message,
    });
  }
};

export const getHealthLogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid health log ID format' });
    }

    const healthLog = await HealthLog.findById(id);

    if (!healthLog) {
      return res.status(404).json({
        success: false,
        message: 'Health log not found',
      });
    }

    res.status(200).json({
      success: true,
      data: healthLog,
    });
  } catch (error) {
    console.error('Error fetching health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health log',
      error: error.message,
    });
  }
};

// individual elder data for analysis

export const getBloodPressureTrends = async (req, res) => {
  try {
    const { elderId } = req.params;
    const { timeframe = 'month' } = req.query;

    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const bloodPressureLogs = await HealthLog.find({
      elderlyId: elderId,
      logDateTime: { $gte: startDate, $lte: endDate },
    }).sort({ logDateTime: 1 });

    res.json(
      bloodPressureLogs.map((log) => ({
        date: log.logDateTime.toISOString().split('T')[0],
        value: log.bloodPressure,
        notes: 'Reading from health log',
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blood pressure trends',
      error: error.message,
    });
  }
};

export const getMedicationAdherence = async (req, res) => {
  try {
    const { elderId } = req.params;
    const { timeframe = 'month' } = req.query;

    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const medicationLogs = await HealthLog.find({
      elderlyId: elderId,
      logDateTime: { $gte: startDate, $lte: endDate },
    }).sort({ logDateTime: 1 });

    res.json(
      medicationLogs.map((log) => ({
        date: log.logDateTime.toISOString().split('T')[0],
        adherence: 100,
        count: log.medications.length,
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching medication adherence',
      error: error.message,
    });
  }
};

export const getRecentAlerts = async (req, res) => {
  try {
    const { elderId } = req.params;

    const recentLogs = await HealthLog.find({
      elderlyId: elderId,
      $or: [{ bloodPressure: { $regex: /high/i } }, { painLevel: { $gt: 7 } }],
    })
      .sort({ logDateTime: -1 })
      .limit(5);

    res.json(
      recentLogs.map((log) => ({
        date: log.logDateTime.toISOString().split('T')[0],
        type: log.bloodPressure ? 'Blood Pressure' : 'Pain Level',
        message: log.bloodPressure
          ? 'Above normal range'
          : 'High pain reported',
      }))
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching recent alerts', error: error.message });
  }
};

//Get patient data
export const getPatientData = async (req, res) => {
  try {
    const { elderlyId } = req.params;

    // Validate elderlyId format
    if (!isValidObjectId(elderlyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid elderly ID format',
      });
    }

    // Fetch patient data from the Elder model
    const elder = await Elder.findById(elderlyId).lean();
    if (!elder) {
      return res.status(404).json({
        success: false,
        error: 'Elderly user not found',
      });
    }

    // Fetch health logs
    const healthLogs = await HealthLog.find({ elderlyId })
      .sort({ logDateTime: -1 })
      .lean();

    // Fetch medications
    const medications = await Medication.find({ elderlyId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch appointments (Events) from the Event model
    const appointmentsData = await Event.find({
      elderIds: elderlyId,
    }).sort({ start: 1 }); // Sort by start time

    // Format the appointments
    const appointments = appointmentsData.map((event) => ({
      date: event.start.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: event.start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }), // Format time as HH:mm
      type: event.title, // Use title as the appointment type
      provider: event.instructions || 'Unknown', // Use instructions as provider if available
      location: event.location,
      notes: event.notes || 'No additional notes', // Default to 'No additional notes' if none are provided
    }));

    // Transform patient data
    const patientData = {
      name: `${elder.firstName} ${elder.lastName}`,
      age: calculateAge(elder.dateOfBirth),
      roomNumber: elder.roomNumber,
      primaryCaregiver: 'Sarah Johnson', // Replace with actual data if available
      insurance: elder.insuranceInfo?.provider || 'Unknown',
      admissionDate: elder.registrationDate.toISOString().split('T')[0],
      allergies: elder.allergies,
      bloodType: elder.bloodType,
      diagnoses: elder.chronicConditions.map((condition) => ({
        condition,
        since: 'Unknown', // Replace with actual data if available
      })),
      emergencyContacts: elder.emergencyContacts.map((contact) => ({
        name: contact.name,
        relation: contact.relationship,
        phone: contact.phone,
        email: contact.email,
      })),
    };

    // Transform health metrics
    const healthMetrics = {
      bloodPressure: healthLogs.map((log) => ({
        date: log.logDateTime.toISOString().split('T')[0],
        systolic: parseInt(log.bloodPressure.split('/')[0]),
        diastolic: parseInt(log.bloodPressure.split('/')[1]),
        pulse: log.heartRate,
        time: log.logDateTime.toTimeString().split(' ')[0],
        notes: log.notes,
      })),
      weight: healthLogs.map((log) => ({
        date: log.logDateTime.toISOString().split('T')[0],
        value: log.weight,
        unit: 'lbs', // Assuming weight is in pounds
        bmi: calculateBMI(log.weight, elder.height), // Replace with actual height if available
      })),
      glucose: healthLogs
        .filter((log) => log.glucose)
        .map((log) => ({
          date: log.logDateTime.toISOString().split('T')[0],
          value: log.glucose,
          time: log.logDateTime.toTimeString().split(' ')[0],
          type: 'Fasting', // Replace with actual type if available
        })),
    };

    // Transform medications
    const medicationSchedule = medications.map((med) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      timeSlots: med.timeSlots,
      status: 'active', // Replace with actual status if available
      refillDate: med.refillDate?.toISOString().split('T')[0],
      sideEffects: med.sideEffects,
      adherence: 95, // Replace with actual adherence if available
    }));

    // Return aggregated data
    res.status(200).json({
      success: true,
      data: {
        patientData,
        healthMetrics,
        medications: medicationSchedule,
        appointments,
      },
    });
  } catch (error) {
    console.error('Error fetching patient data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Helper function to calculate BMI (replace height with actual value if available)
const calculateBMI = (weight, height) => {
  if (!height) return null;
  const heightInMeters = height / 100; // Assuming height is in centimeters
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};
