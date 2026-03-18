import mongoose from 'mongoose';
import { USER_ROLES } from '../enums/roles.enum.js';
import { USER_STATUS } from '../enums/status.enum.js';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.TEACHER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.INACTIVE,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
