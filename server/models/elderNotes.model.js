import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    elderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Elder', // Assuming you have an Elder model
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      required: true,
      enum: ['general', 'medication', 'vital', 'behavior', 'treatment'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['normal', 'urgent', 'follow-up'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
