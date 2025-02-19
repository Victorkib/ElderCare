import { isValidObjectId } from 'mongoose';
import Caregiver from '../models/caregiver.model.js';
import Elder from '../models/elder.model.js';
import Event from '../models/event.model.js';
import HealthLog from '../models/healthLog.model.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Medication from '../models/Medication.model.js';
import Note from '../models/elderNotes.model.js';

dotenv.config();

// Configure Cloudinary (Ensure you have the correct credentials set up)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register a new elder
export const registerElder = async (req, res) => {
  try {
    const elderData = req.body;
    const elder = await Elder.create(elderData);

    res.status(201).json({
      status: 'success',
      data: {
        elder,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error?.message || 'Server error',
    });
  }
};

// Get all elders with filters, search, and pagination
export const getAllElders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'active' }; // Default filter

    if (req.query.searchTerm) {
      query.$or = [
        { firstName: new RegExp(req.query.searchTerm, 'i') },
        { lastName: new RegExp(req.query.searchTerm, 'i') },
        { roomNumber: new RegExp(req.query.searchTerm, 'i') },
      ];
    }

    const elders = await Elder.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ lastName: 1, firstName: 1 });

    const total = await Elder.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: elders.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        elders,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

export const getAllELderWithoutFiltering = async (req, res) => {
  try {
    const allElders = await Elder.find({});
    if (allElders.length <= 0) {
      return res.status(400).json({ message: 'No elders found!' });
    }
    res.status(200).json(allElders);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

export const getElder = async (req, res) => {
  try {
    const elder = await Elder.findById(req.params.id).populate(
      'assignedCaregivers'
    );

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    // Fetch upcoming events for this elder
    const upcomingEventsData = await Event.find({
      elderIds: req.params.id,
    }).sort({ start: 1 }); // Sort events by start time (earliest first)

    // Map events to the expected format
    const upcomingEvents = upcomingEventsData.map((event) => ({
      time: new Date(event.start).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }), // Format the start time as 'HH:mm'
      type: event.type,
      name: event.title, // Use the title of the event as 'name'
    }));

    res.status(200).json({
      elder,
      upcomingEvents,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Update an elder
export const updateElder = async (req, res) => {
  try {
    const elder = await Elder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        elder,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Extract Cloudinary public ID
const getPublicIdFromUrl = (url) => {
  return url?.split('/')?.slice(-2)?.join('/')?.split('.')[0] || '';
};

// Delete files from Cloudinary
const deleteFilesFromCloudinary = async (urls) => {
  try {
    for (const url of urls) {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }
  } catch (error) {
    console.error('Error deleting files from Cloudinary:', error);
    throw error;
  }
};

// Update Elder Controller
export const updateElderData = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid elder ID' });
  }

  // Start a Mongoose transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch current elder data
    const currentElder = await Elder.findById(id).session(session);
    if (!currentElder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Elder not found' });
    }

    // Construct update object
    const updateObject = { $set: {} };

    // Handle array fields properly
    for (const key of Object.keys(updateData)) {
      if (Array.isArray(updateData[key])) {
        updateObject.$set[key] = updateData[key]; // Fully replace arrays like emergencyContacts
      } else {
        updateObject.$set[key] = updateData[key]; // Update other fields normally
      }
    }

    // Update elder's information in the database
    const updatedElder = await Elder.findByIdAndUpdate(id, updateObject, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedElder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ error: 'Failed to update elder' });
    }

    // Handle Cloudinary file deletions only after successful update
    const fileFields = [
      'photo',
      'insuranceInfo.documents',
      'legalDocuments',
      'medicalDocuments',
    ];

    for (const field of fileFields) {
      const currentValue = currentElder.get(field);
      const newValue = updateData[field];

      if (
        newValue &&
        JSON.stringify(currentValue) !== JSON.stringify(newValue)
      ) {
        if (Array.isArray(currentValue)) {
          const filesToDelete = currentValue.filter(
            (file) => !newValue.includes(file)
          );
          if (filesToDelete.length > 0) {
            await deleteFilesFromCloudinary(filesToDelete);
          }
        } else if (
          typeof currentValue === 'string' &&
          currentValue !== newValue
        ) {
          await deleteFilesFromCloudinary([currentValue]);
        }
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: 'Elder updated successfully',
      data: updatedElder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update elder',
      error: error.message,
    });
  }
};

//update Elder Image
export const updateElderImage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const elder = await Elder.findById(req.params.id).session(session);

    if (!elder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    // If a new photo is provided, delete the old one
    if (req.body.photo && elder.photo) {
      const oldPhotoPublicId = elder.photo.split('/').pop().split('.')[0];

      try {
        await cloudinary.v2.uploader.destroy(`avatars/${oldPhotoPublicId}`);
      } catch (error) {
        console.error('Failed to delete old image from Cloudinary:', error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
          status: 'error',
          message: 'Failed to delete old image from Cloudinary',
        });
      }
    }

    // Update elder data with the new image URL
    const updatedElder = await Elder.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: {
        elder: updatedElder,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Soft delete an elder by updating their status
export const deleteElder = async (req, res) => {
  try {
    const elder = await Elder.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Delete Elder Controller
export const deleteElderData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid elder ID' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the elder
    const elder = await Elder.findById(id).session(session);
    if (!elder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Elder not found' });
    }

    // Step 2: Remove elder from caregivers' assignedElders list
    await Caregiver.updateMany(
      { assignedElders: id },
      { $pull: { assignedElders: id } },
      { session }
    );

    // Step 3: Delete associated health logs
    await HealthLog.deleteMany({ elderlyId: id }).session(session);

    // Step 4: Delete associated medications
    await Medication.deleteMany({ elderlyId: id }).session(session);

    // Step 5: Delete associated events
    await Event.deleteMany({ elderIds: id }).session(session);

    // Step 6: Delete associated notes
    await Note.deleteMany({ elderId: id }).session(session);

    // Step 7: Delete elder’s documents and profile picture from Cloudinary
    const fileFields = [
      'photo',
      'insuranceInfo.documents',
      'legalDocuments',
      'medicalDocuments',
    ];

    for (const field of fileFields) {
      const files = elder.get(field) || [];
      if (Array.isArray(files) && files.length > 0) {
        await deleteFilesFromCloudinary(files);
      } else if (typeof files === 'string' && files.trim() !== '') {
        await deleteFilesFromCloudinary([files]);
      }
    }

    // Step 8: Delete the elder
    await Elder.findByIdAndDelete(id).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Elder and all associated records deleted successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      error: 'Failed to delete elder',
      details: error.message,
    });
  }
};

// Get medical information for a specific elder
export const getElderMedicalInfo = async (req, res) => {
  try {
    const elder = await Elder.findById(req.params.id).select(
      'bloodType allergies chronicConditions medications mobilityStatus cognitiveStatus specialNeeds previousHospitalizations surgicalHistory familyHistory'
    );

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        medical: elder,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Update emergency contacts for an elder
export const updateEmergencyContacts = async (req, res) => {
  try {
    const elder = await Elder.findByIdAndUpdate(
      req.params.id,
      { emergencyContacts: req.body.emergencyContacts },
      { new: true, runValidators: true }
    );

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        emergencyContacts: elder.emergencyContacts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// Update care preferences for an elder
export const updateCarePreferences = async (req, res) => {
  try {
    const elder = await Elder.findByIdAndUpdate(
      req.params.id,
      {
        preferredDailySchedule: req.body.preferredDailySchedule,
        personalCarePreferences: req.body.personalCarePreferences,
      },
      { new: true, runValidators: true }
    );

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        carePreferences: {
          preferredDailySchedule: elder.preferredDailySchedule,
          personalCarePreferences: elder.personalCarePreferences,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error',
    });
  }
};

// for the individual health log data

export const getPatientProfile = async (req, res) => {
  try {
    const { elderId } = req.params;
    const patient = await Elder.findById(elderId).select(
      'firstName lastName roomNumber emergencyContacts chronicConditions medications'
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      name: `${patient.firstName} ${patient.lastName}`,
      roomNumber: patient.roomNumber,
      emergencyContacts: patient.emergencyContacts.map((contact) => ({
        name: contact.name,
        relation: contact.relationship,
        phone: contact.phone,
      })),
      medicalConditions: patient.chronicConditions || [],
      medications: patient.medications.map((med) => ({
        name: med,
        dosage: '',
        frequency: '',
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching patient profile',
      error: error.message,
    });
  }
};

export const getMedicalProfile = async (req, res) => {
  try {
    const { elderId } = req.params;
    const patient = await Elder.findById(elderId).select(
      'chronicConditions medications'
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      medicalConditions: patient.chronicConditions || [],
      medications: patient.medications || [],
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching medical profile',
      error: error.message,
    });
  }
};

// // Helper function to calculate age from date of birth
// const calculateAge = (dateOfBirth) => {
//   const today = new Date();
//   const birthDate = new Date(dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDifference = today.getMonth() - birthDate.getMonth();
//   if (
//     monthDifference < 0 ||
//     (monthDifference === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }
//   return age;
// };

// // Controller function to get all elders
// export const getAllOrganizedElders = async (req, res) => {
//   try {
//     // Fetch all elders from the database
//     const elders = await Elder.find({});
//     console.log('elders: ', elders);

//     if (!elders || elders.length === 0) {
//       return res.status(200).json([]);
//     }

//     // Fetch all health logs for the elder IDs in one go
//     const healthLogs = await HealthLog.find({
//       elderlyId: { $in: elders.map((elder) => elder._id) },
//     })
//       .sort({ logDateTime: -1 }) // Sort to get latest logs first
//       .lean();

//     // Map health logs to their corresponding elder
//     const healthLogMap = {};
//     healthLogs.forEach((log) => {
//       if (!healthLogMap[log.elderlyId.toString()]) {
//         healthLogMap[log.elderlyId.toString()] = log;
//       }
//     });

//     // Organize the elder data
//     const elderData = elders.map((elder) => {
//       const latestHealthLog = healthLogMap[elder._id.toString()] || {};

//       return {
//         id: elder._id.toString(), // Ensure it's a string
//         name: `${elder.firstName || 'N/A'} ${elder.lastName || 'N/A'}`,
//         age: elder.dateOfBirth ? calculateAge(elder.dateOfBirth) : 'N/A',
//         room: elder.roomNumber || 'N/A',
//         careLevel: latestHealthLog.healthStatus || 'N/A',
//         primaryCaregiver: elder.primaryCaregiver || 'N/A',
//         lastCheckup: latestHealthLog.logDateTime || 'N/A',
//         medications: elder.medications?.length || 0,
//         status: latestHealthLog.healthStatus || 'N/A',
//         nextAppointment: 'N/A', // Placeholder value
//         dietaryRestrictions: elder.dietaryRestrictions || [],
//         emergencyContact: elder.emergencyContacts?.[0]?.name
//           ? `${elder.emergencyContacts[0].name} (${
//               elder.emergencyContacts[0].relationship || 'N/A'
//             })`
//           : 'N/A',
//         phone: elder.emergencyContacts?.[0]?.phone || 'N/A',
//       };
//     });

//     res.status(200).json(elderData);
//   } catch (error) {
//     console.error('Error fetching elders:', error);
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

// Fetch all elders and format their data
export const getAllEldersDetails = async (req, res) => {
  try {
    // Fetch all elders
    const elders = await Elder.find().populate('emergencyContacts').exec();

    if (!elders || elders.length === 0) {
      throw new Error('No elders found');
    }

    // Process all elders in parallel
    const formattedElders = await Promise.all(
      elders.map(async (elder) => {
        // Fetch the latest health log for this elder
        const latestHealthLog = await HealthLog.findOne({
          elderlyId: elder._id,
        })
          .sort({ logDateTime: -1 }) // Get most recent log
          .exec();

        // Fallback for missing health logs
        const defaultHealthLog = {
          healthStatus: 'Healthy',
          logDateTime: new Date(0), // Epoch time as default
        };

        // Format the data
        return {
          id: elder._id,
          name: `${elder.firstName} ${elder.lastName}`,
          age: calculateElderAge(elder.dateOfBirth),
          room: elder.roomNumber,
          careLevel: determineCareLevel(
            latestHealthLog?.healthStatus || defaultHealthLog.healthStatus
          ),
          primaryCaregiver: elder.emergencyContacts[0]?.name || 'Not specified',
          lastCheckup: latestHealthLog
            ? latestHealthLog.logDateTime.toISOString().split('T')[0]
            : 'No checkups',
          medications: elder.medications.length,
          status: elder.status,
          nextAppointment: '2024-02-10', // Replace with actual appointment logic
          dietaryRestrictions: elder.dietaryRestrictions,
          emergencyContact: elder.emergencyContacts[0]
            ? `${elder.emergencyContacts[0].name} (${elder.emergencyContacts[0].relationship})`
            : 'Not specified',
          phone: elder.emergencyContacts[0]?.phone || 'Not specified',
        };
      })
    );

    res.status(200).json(formattedElders);
  } catch (error) {
    console.error('Error fetching elders:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Helper function to calculate age from date of birth
const calculateElderAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Helper function to determine care level based on health status
const determineCareLevel = (healthStatus) => {
  switch (healthStatus) {
    case 'Critical':
      return 'High';
    case 'At Risk':
      return 'Medium';
    case 'Healthy':
      return 'Low';
    default:
      return 'Not specified';
  }
};

export const assignCaregiver = async (req, res) => {
  try {
    const { elderId } = req.params;
    const { caregiverId } = req.body;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(elderId) ||
      !mongoose.Types.ObjectId.isValid(caregiverId)
    ) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid ID format' });
    }

    // Check if the elder exists
    const elder = await Elder.findById(elderId);
    if (!elder) {
      return res.status(404).json({ success: false, error: 'Elder not found' });
    }

    // Check if the caregiver exists
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res
        .status(404)
        .json({ success: false, error: 'Caregiver not found' });
    }

    // Check how many elders the caregiver is already assigned to
    if (caregiver.assignedElders.length >= 5) {
      return res.status(400).json({
        success: false,
        error: 'Caregiver has reached the maximum limit of 5 elders',
      });
    }

    // Check if the caregiver is already assigned to this elder
    if (elder.assignedCaregivers.includes(caregiverId)) {
      return res.status(400).json({
        success: false,
        error: 'Caregiver already assigned to this elder',
      });
    }

    // Assign the caregiver to the elder
    elder.assignedCaregivers.push(caregiverId);
    await elder.save();

    // Assign the elder to the caregiver
    caregiver.assignedElders.push(new mongoose.Types.ObjectId(elderId));
    await caregiver.save();

    res.status(200).json({
      success: true,
      message: 'Caregiver assigned successfully',
      assignedCaregivers: elder.assignedCaregivers,
      assignedElders: caregiver.assignedElders,
    });
  } catch (error) {
    console.error('Error assigning caregiver:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
};
