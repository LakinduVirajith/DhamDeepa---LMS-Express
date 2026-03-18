import mongoose from 'mongoose';
import { PREFECT_POSITIONS } from '../enums/prefect.enum.js';

const prefectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: Object.values(PREFECT_POSITIONS),
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    responsibilities: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one responsibility is required',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent a student from being assigned multiple prefect positions simultaneously
prefectSchema.index({ student: 1, position: 1 }, { unique: true });

export default mongoose.model('Prefect', prefectSchema);
