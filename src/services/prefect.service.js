import Prefect from '../models/prefect.model.js';
import Student from '../models/student.model.js';
import User from '../models/user.model.js';
import { USER_ROLES } from '../enums/roles.enum.js';
import { PREFECT_POSITIONS } from '../enums/prefect.enum.js';

/**
 * Create a new prefect
 */
export const createPrefectService = async ({ user, prefectData }) => {
  if (![USER_ROLES.ADMIN, USER_ROLES.TEACHER].includes(user.role))
    throw new Error('Only admins or teachers can create prefects');

  // Teachers can only assign their own students
  if (user.role === USER_ROLES.TEACHER) {
    const student = await Student.findById(prefectData.student);
    if (!student) throw new Error('Student not found');
    if (!student.academicInfo.teacher.equals(user._id))
      throw new Error('You can only assign prefect for your own student');
  }

  // Check if a User already exists for the student
  const prefectUser = await User.findOne({
    clerkId: prefectData.student.toString(),
  });
  if (!prefectUser) {
    const student = await Student.findById(prefectData.student);
    if (!student) throw new Error('Student not found for User creation');
  }

  // Validate position
  if (!Object.values(PREFECT_POSITIONS).includes(prefectData.position)) {
    throw new Error(
      `Invalid position. Allowed values: ${Object.values(PREFECT_POSITIONS).join(', ')}`,
    );
  }

  const prefect = new Prefect(prefectData);
  await prefect.save();
  return prefect;
};

/**
 * Get prefect by ID
 */
export const getPrefectByIdService = async (prefectId) => {
  const prefect = await Prefect.findById(prefectId).populate({
    path: 'student',
    populate: {
      path: 'academicInfo.teacher',
      select: 'firstName lastName email role status',
    },
  });

  if (!prefect) throw new Error('Prefect not found');
  return prefect;
};

/**
 * Get all prefects with pagination, filters, and search
 * @param {Object} user - current user (req.user)
 * @param {Number} page - page number
 * @param {Number} limit - items per page
 * @param {String} position - optional filter
 * @param {String} status - optional filter (student status)
 * @param {String} search - optional search by student name/email
 */
export const getAllPrefectsService = async ({
  user,
  page = 1,
  limit = 10,
  position,
  status,
  search,
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  // Role-based access
  if (user.role === USER_ROLES.TEACHER) {
    filter['student.academicInfo.teacher'] = user._id;
  }

  // Filter by position
  if (position) {
    if (!Object.values(PREFECT_POSITIONS).includes(position))
      throw new Error(
        `Invalid position. Allowed values: ${Object.values(PREFECT_POSITIONS).join(', ')}`,
      );
    filter.position = position;
  }

  // Query DB with population
  let prefects = await Prefect.find()
    .populate({
      path: 'student',
      populate: {
        path: 'academicInfo.teacher',
        select: 'firstName lastName email role status',
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Status filter (student status)
  if (status) {
    prefects = prefects.filter((p) => p.user?.status === status);
  }

  // Search by student name/email
  if (search) {
    const keyword = search.toLowerCase();
    prefects = prefects.filter(
      (p) =>
        p.student?.personalInfo.fullName.toLowerCase().includes(keyword) ||
        p.student?.personalInfo.contact.email?.toLowerCase().includes(keyword),
    );
  }

  const total = await Prefect.countDocuments();

  return { prefects, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Update a prefect
 */
export const updatePrefectService = async ({ user, prefectId, updateData }) => {
  const prefect = await Prefect.findById(prefectId).populate('student');
  if (!prefect) throw new Error('Prefect not found');

  // Role-based update: only admin or teacher of student
  if (
    user.role !== USER_ROLES.ADMIN &&
    !prefect.student.academicInfo.teacher.equals(user._id)
  ) {
    throw new Error('Forbidden');
  }

  // Validate position if updated
  if (
    updateData.position &&
    !Object.values(PREFECT_POSITIONS).includes(updateData.position)
  )
    throw new Error(
      `Invalid position. Allowed values: ${Object.values(PREFECT_POSITIONS).join(', ')}`,
    );

  Object.assign(prefect, updateData);
  await prefect.save();
  return prefect;
};

/**
 * Delete a prefect
 */
export const deletePrefectService = async ({ user, prefectId }) => {
  const prefect = await Prefect.findById(prefectId).populate('student');
  if (!prefect) throw new Error('Prefect not found');

  if (
    user.role !== USER_ROLES.ADMIN &&
    !prefect.student.academicInfo.teacher.equals(user._id)
  ) {
    throw new Error('Forbidden');
  }

  await prefect.remove();
  return prefect;
};
