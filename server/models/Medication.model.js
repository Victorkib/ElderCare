import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    elderlyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Elder',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    timeSlots: {
      type: [String], // Array of strings (e.g., ["08:00", "12:00"])
      required: true,
    },
    refillDate: {
      type: Date,
    },
    sideEffects: {
      type: [String], // Array of strings (e.g., ["Nausea", "Headache"])
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;
