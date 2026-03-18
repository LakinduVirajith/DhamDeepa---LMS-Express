import { EMPLOYMENT_TYPE } from '../enums/employment.enum.js';
import { USER_ROLES } from '../enums/roles.enum.js';
import Teacher from '../models/teacher.model.js';

/**
 * Create a teacher
 */
export const createTeacher = async ({ user, teacherData }) => {
  if (user.role !== USER_ROLES.ADMIN)
    throw new Error('Only admins can create teachers');

  const teacher = new Teacher(teacherData);
  await teacher.save();
  return teacher;
};

/**
 * Get teacher by ID with populated user info
 */
export const getTeacherById = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId).populate(
    'user',
    'firstName lastName email role status',
  );
  if (!teacher) throw new Error('Teacher not found');
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
  user,
  page = 1,
  limit = 10,
  status,
  employmentType,
  subject,
  search,
}) => {
  if (user.role !== USER_ROLES.ADMIN)
    throw new Error('Only admins can view all teachers');

  const skip = (page - 1) * limit;

  // Build filters
  const filter = {};

  if (employmentType) {
    if (!Object.values(EMPLOYMENT_TYPE).includes(employmentType)) {
      throw new Error(
        `Invalid employmentType. Allowed values: ${Object.values(EMPLOYMENT_TYPE).join(', ')}`,
      );
    }
    filter['professionalInfo.employmentType'] = employmentType;
  }
  if (subject) filter['professionalInfo.subjects'] = subject;

  // Query DB
  let teachers = await Teacher.find(filter)
    .populate('user', 'firstName lastName email role status')
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
 * Update teacher details
 */
export const updateTeacher = async ({ user, teacherId, updateData }) => {
  if (user.role !== USER_ROLES.ADMIN)
    throw new Error('Only admins can update teachers');

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found');

  Object.assign(teacher, updateData);
  await teacher.save();
  return teacher;
};

/**
 * Delete a teacher
 */
export const deleteTeacher = async ({ user, teacherId }) => {
  if (user.role !== USER_ROLES.ADMIN)
    throw new Error('Only admins can delete teachers');

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new Error('Teacher not found');

  await teacher.remove();
};
