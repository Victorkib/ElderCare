// models/Elder.js
import mongoose from 'mongoose';

const elderSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      required: true,
    },
    photo: {
      type: String, // Cloudinary URL
    },
    primaryLanguage: String,
    otherLanguages: [String],
    religion: String,
    dietaryRestrictions: [String],

    // Medical Information
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    allergies: [String],
    chronicConditions: [String],
    medications: [String],
    mobilityStatus: {
      type: String,
      enum: [
        'independent',
        'requires-walker',
        'requires-wheelchair',
        'bed-ridden',
      ],
    },
    cognitiveStatus: String,
    specialNeeds: [String],

    // Contact Information
    roomNumber: String,
    previousAddress: String,
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
        },
        relationship: String,
        phone: {
          type: String,
          required: true,
        },
        email: String,
        address: String,
        isLegalGuardian: Boolean,
      },
    ],

    // Care Preferences
    preferredDailySchedule: {
      wakeTime: String,
      bedTime: String,
      mealTimes: [String],
      activityPreferences: [String],
    },
    personalCarePreferences: {
      bathing: String,
      dressing: String,
      grooming: String,
    },

    // Medical History
    previousHospitalizations: [String],
    surgicalHistory: [String],
    familyHistory: [String],

    // Documents
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      documents: [String], // Array of Cloudinary URLs
    },
    legalDocuments: [String], // Array of Cloudinary URLs
    medicalDocuments: [String], // Array of Cloudinary URLs

    // Metadata
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deceased', 'transferred'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
elderSchema.index({ firstName: 1, lastName: 1 });
elderSchema.index({ roomNumber: 1 });
elderSchema.index({ status: 1 });

// Middleware to update lastUpdated timestamp
elderSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

const Elder = mongoose.model('Elder', elderSchema);
export default Elder;
