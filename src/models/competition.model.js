import mongoose from 'mongoose';

/**
 * Participant Subdocument
 */
const participantSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { _id: false },
);

/**
 * Competition Schema
 */
const competitionSchema = new mongoose.Schema(
  {
    competitionType: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    year: {
      type: Number,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    participants: {
      type: [participantSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

/**
 * Auto-set year
 */
competitionSchema.pre('save', function (next) {
  if (this.eventDate) {
    this.year = new Date(this.eventDate).getFullYear();
  }
  next();
});

/**
 * Prevent duplicate students in same competition
 */
competitionSchema.pre('save', function (next) {
  const studentIds = this.participants.map((p) => p.student.toString());
  const uniqueIds = new Set(studentIds);

  if (studentIds.length !== uniqueIds.size) {
    return next(
      new Error('Duplicate students are not allowed in a competition'),
    );
  }

  next();
});

export default mongoose.model('Competition', competitionSchema);
