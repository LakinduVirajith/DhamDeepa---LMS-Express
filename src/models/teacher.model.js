import mongoose from 'mongoose';
import { GENDER } from '../enums/gender.enum.js';
import { EMPLOYMENT_TYPE } from '../enums/employment.enum.js';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Personal Information
    personalInfo: {
      dateOfBirth: {
        type: Date,
        required: true,
      },

      gender: {
        type: String,
        enum: Object.values(GENDER),
        required: true,
      },

      nic: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 12,
      },

      contact: {
        phoneNumber: {
          type: String,
          required: true,
          match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        },
      },

      address: {
        street: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 100,
        },
        city: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 100,
        },
        postalCode: {
          type: String,
          required: true,
          match: [/^\d{5}$/, 'Postal code must be 5 digits'],
        },
        policeDivision: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 100,
        },
      },
    },

    // Professional Information
    professionalInfo: {
      qualifications: {
        type: [String],
      },

      yearsOfExperience: {
        type: Number,
        min: 0,
        max: 50,
      },

      subjects: {
        type: [String],
        required: true,
        validate: {
          validator: (arr) => arr.length > 0,
          message: 'At least one subject is required',
        },
      },

      bio: {
        type: String,
        maxlength: 1000,
      },

      maxStudents: {
        type: Number,
        min: 1,
        max: 50,
      },

      employmentType: {
        type: String,
        enum: Object.values(EMPLOYMENT_TYPE),
        required: true,
      },

      salary: {
        type: Number,
        min: 0,
      },

      joinedDate: {
        type: Date,
      },
    },

    // 🏦 Banking Information
    bankInfo: {
      bankName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
        minlength: 6,
        maxlength: 20,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model('TeacherProfile', teacherProfileSchema);
