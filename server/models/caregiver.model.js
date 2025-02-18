import mongoose from 'mongoose';

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  certification: { type: String, required: true },
  availability: { type: String, required: true },
  assignedElders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Elder' }], // Updated to store ObjectIds
  status: { type: String, default: 'Active' },
  yearsOfExperience: { type: Number, required: true },
  languages: { type: [String], default: [] },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true },
  },
});

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
export default Caregiver;
