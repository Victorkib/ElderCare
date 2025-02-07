import Elder from '../models/elder.model.js';
import HealthLog from '../models/healthLog.model.js';

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
      message: error.message || 'Server error',
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

// Get a single elder by ID
export const getElder = async (req, res) => {
  try {
    const elder = await Elder.findById(req.params.id);

    if (!elder) {
      return res.status(404).json({
        status: 'error',
        message: 'No elder found with that ID',
      });
    }

    res.status(200).json(elder);
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
