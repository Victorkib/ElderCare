import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Event title is required.'] },
  start: { type: Date, required: [true, 'Event start time is required.'] },
  end: {
    type: Date,
    required: [true, 'Event end time is required.'],
    validate: {
      validator: function (value) {
        return value > this.start; // Ensure end time is after start time
      },
      message: 'End time must be after start time.',
    },
  },
  type: {
    type: String,
    required: [true, 'Event type is required.'],
    enum: {
      values: ['medication', 'appointment', 'activity', 'custom'],
      message: 'Invalid event type.',
    },
  },
  elderIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Elder',
      required: [true, 'At least one elder is required.'],
    },
  ],
  dosage: { type: String, default: '' },
  instructions: { type: String, default: '' },
  recurring: {
    type: String,
    default: 'none',
    enum: {
      values: ['none', 'daily', 'weekly', 'custom'],
      message: 'Invalid recurrence pattern.',
    },
  },
  reminders: [{ type: Number, default: [] }],
  notes: { type: String, default: '' },
});

// Add indexes for faster queries
eventSchema.index({ start: 1 }); // Index for start time
eventSchema.index({ elderIds: 1 }); // Index for elderIds

const Event = mongoose.model('Event', eventSchema);

export default Event;
