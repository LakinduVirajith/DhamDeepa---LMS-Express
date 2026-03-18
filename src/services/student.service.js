import { USER_ROLES } from '../enums/roles.enum.js';
import { SCHOOL_GRADES } from '../enums/grades.enum.js';
import Student from '../models/student.model.js';

/**
 * Create a new student
 */
export const createStudentService = async ({ user, studentData }) => {
  if (user.role !== USER_ROLES.TEACHER)
    throw new Error('Only teachers can create students');

  // Validate grade
  if (!Object.values(SCHOOL_GRADES).includes(studentData.schoolGrade)) {
    throw new Error('Invalid school grade');
  }

  const student = new Student({
    ...studentData,
    teacher: user._id,
  });

  await student.save();
  return student;
};

/**
 * Get a student by ID
 */
export const getStudentByIdService = async (studentId) => {
  const student = await Student.findById(studentId).populate(
    'teacher',
    'firstName lastName email role',
  );
  if (!student) throw new Error('Student not found');
  return student;
};

/**
 * Get students with pagination, filters, and search
 * @param {Object} user - current user (req.user)
 * @param {Number} page - page number (default 1)
 * @param {Number} limit - items per page (default 10)
 * @param {String} teacherId - optional filter by teacher (admin only)
 * @param {String} grade - optional filter by school grade
 * @param {String} search - optional search by name or email
 */
export const getStudents = async ({
  user,
  page = 1,
  limit = 10,
  teacherId,
  grade,
  search,
}) => {
  const skip = (page - 1) * limit;
  let filter = {};

  // Role-based filtering
  if (user.role === USER_ROLES.TEACHER) {
    filter.teacher = user._id;
  } else if (user.role === USER_ROLES.ADMIN && teacherId) {
    filter.teacher = teacherId;
  }

  // Optional grade filter
  if (grade && Object.values(SCHOOL_GRADES).includes(grade)) {
    filter.schoolGrade = grade;
  }

  // Query DB
  let students = await Student.find(filter)
    .populate('teacher', 'firstName lastName email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Search
  if (search) {
    const keyword = search.toLowerCase();
    students = students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(keyword) ||
        s.email?.toLowerCase().includes(keyword),
    );
  }

  const total = await Student.countDocuments(filter);

  return {
    students,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Update a student by ID
 */
export const updateStudentService = async ({ user, studentId, updateData }) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  if (user.role !== USER_ROLES.ADMIN && !student.teacher.equals(user._id)) {
    throw new Error('Forbidden');
  }

  // Validate grade if updated
  if (
    updateData.schoolGrade &&
    !Object.values(SCHOOL_GRADES).includes(updateData.schoolGrade)
  ) {
    throw new Error('Invalid school grade');
  }

  Object.assign(student, updateData);
  await student.save();
  return student;
};

/**
 * Delete a student by ID
 */
export const deleteStudentService = async ({ user, studentId }) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  if (user.role !== USER_ROLES.ADMIN && !student.teacher.equals(user._id)) {
    throw new Error('Forbidden');
  }

  await student.remove();
  return student;
};
