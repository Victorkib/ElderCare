import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema(
  {
    elderlyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Elder',
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    glucose: {
      type: Number,
    },
    oxygen: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    painLevel: {
      type: Number,
      min: 1,
      max: 10,
    },
    notes: {
      type: String,
      required: true,
    },
    medications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
      },
    ],
    logDateTime: {
      type: Date,
      required: true,
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'At Risk', 'Critical'],
      default: 'Healthy',
    },
  },
  { timestamps: true }
);

const HealthLog = mongoose.model('HealthLog', healthLogSchema);

export default HealthLog;
