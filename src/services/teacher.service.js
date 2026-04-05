import { EMPLOYMENT_TYPE } from '../enums/employment.enum.js';
import { USER_STATUS } from '../enums/status.enum.js';
import Teacher from '../models/teacher.model.js';
import User from '../models/user.model.js';

/**
 * Create a teacher
 */
export const createTeacher = async ({ user, teacherData }) => {
  if (user.status !== USER_STATUS.ACTIVE)
    throw new Error('Inactive teachers cannot create teacher profiles');

  const teacher = new Teacher({
    ...teacherData,
    user: user._id,
  });

  await teacher.save();
  return teacher;
};

/**
 * Get teacher by Clerk ID with populated user info
 */
export const getTeacherByClerkId = async (clerkId) => {
  const user = await User.findOne({ clerkId });

  if (!user) {
    throw new Error('User not found');
  }

  const teacher = await Teacher.findOne({ user: user._id }).populate(
    'user',
    'firstName lastName email role status avatarUrl',
  );

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  return teacher;
};

/**
 * Get all teachers with pagination, optional filters, and search
 * @param {Object} user - Current authenticated user (from req.user)
 * @param {Number} page - Page number (default: 1)
 * @param {Number} limit - Number of records per page (default: 10)
 * @param {String} status - Filter by teacher account status (e.g., ACTIVE, INACTIVE)
 * @param {String} employmentType - Filter by employment type (FULL_TIME, PART_TIME, CONTRACT, VISITING)
 * @param {String} subject - Filter by subject (e.g., Math, Science)
 * @param {String} search - Search by first name, last name, or email
 */
export const getAllTeachers = async ({
  page = 1,
  limit = 10,
  status,
  employmentType,
  subject,
  search,
}) => {
  const skip = (page - 1) * limit;

  // Build filters
  const filter = {};

  if (employmentType) {
    if (!Object.values(EMPLOYMENT_TYPE).includes(employmentType)) {
      throw new Error(
        `Invalid employment type. Allowed values: ${Object.values(EMPLOYMENT_TYPE).join(', ')}`,
      );
    }
    filter['professionalInfo.employmentType'] = employmentType;
  }
  if (subject) {
    filter['professionalInfo.subjects'] = {
      $elemMatch: {
        $regex: new RegExp(subject, 'i'),
      },
    };
  }

  // Query DB
  let teachers = await Teacher.find(filter)
    .populate('user', 'firstName lastName email role status avatarUrl')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Search on populated user
  if (search) {
    const keyword = search.toLowerCase();
    teachers = teachers.filter((t) => {
      const u = t.user;
      return (
        u?.firstName?.toLowerCase().includes(keyword) ||
        u?.lastName?.toLowerCase().includes(keyword) ||
        u?.email?.toLowerCase().includes(keyword)
      );
    });
  }

  // Status filter
  if (status) teachers = teachers.filter((t) => t.user?.status === status);

  const total = await Teacher.countDocuments(filter);

  return { teachers, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Get teacher by ID with populated user info
 */
export const getTeacherById = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId).populate(
    'user',
    'firstName lastName email role status avatarUrl',
  );
  if (!teacher) throw new Error('Teacher not found');
  return teacher;
};

/**
 * Update teacher details
 */
export const updateTeacher = async ({ teacherId, updateData }) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found for update');

  const merge = (target, source) => {
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        if (!target[key]) target[key] = {};
        merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  merge(teacher, updateData);

  await teacher.save();
  return teacher;
};

/**
 * Delete a teacher
 */
export const deleteTeacher = async ({ teacherId }) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found for deletion');

  await teacher.remove();
};
