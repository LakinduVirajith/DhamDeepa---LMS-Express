import mongoose from 'mongoose';
import { GENDER } from '../enums/gender.enum.js';

const studentSchema = new mongoose.Schema(
  {
    // Personal Information
    personalInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
      },
      dateOfBirth: { type: Date, required: true },
      gender: {
        type: String,
        enum: Object.values(GENDER),
        required: true,
      },
      contact: {
        phoneNumber: {
          type: String,
          required: true,
          match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
          match: [/.+@.+\..+/, 'Invalid email address'],
        },
      },
      address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200,
      },
    },

    // Guardian / Parent Information
    guardianInfo: {
      motherName: { type: String, trim: true },
      motherOccupation: { type: String, trim: true },
      fatherName: { type: String, trim: true },
      fatherOccupation: { type: String, trim: true },
      guardianName: { type: String, required: true, trim: true },
      emergencyContact: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Emergency contact must be 10 digits'],
      },
    },

    // Academic Information
    academicInfo: {
      schoolGrade: {
        type: String,
        required: true,
        enum: Object.values(SCHOOL_GRADES),
      },
      registeredDate: { type: Date, required: true, default: Date.now },
      notes: { type: String, maxlength: 1000 },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model('Student', studentSchema);
