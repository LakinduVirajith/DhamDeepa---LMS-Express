import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherByClerkId,
} from '../services/teacher.service.js';

/**
 * POST /api/v1/teachers
 * Create a new teacher (ADMIN only)
 */
export const createTeacherController = async (req, res) => {
  try {
    const teacher = await createTeacher({
      user: req.user,
      teacherData: req.body,
    });
    res.status(201).json(teacher);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * GET /api/v1/teachers/:id
 * Get a teacher by ID
 */
export const getTeacherByIdController = async (req, res) => {
  try {
    const teacher = await getTeacherById(req.params.teacherId);
    res.status(200).json(teacher);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * GET /api/v1/teachers/clerk/:clerkId
 * Get a teacher by Clerk ID
 */
export const getTeacherByClerkIdController = async (req, res) => {
  try {
    const teacher = await getTeacherByClerkId(req.params.clerkId);
    res.status(200).json(teacher);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * GET /api/v1/teachers
 * Get all teachers with optional pagination, filters, and search (ADMIN only)
 * Example query: /api/v1/teachers?page=1&limit=10&status=ACTIVE&employmentType=FULL_TIME&subject=Math&search=John
 */
export const getAllTeachersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { status, employmentType, subject, search } = req.query;

    const teachers = await getAllTeachers({
      page,
      limit,
      status,
      employmentType,
      subject,
      search,
    });

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/teachers/:id
 * Update teacher details (ADMIN only)
 */
export const updateTeacherController = async (req, res) => {
  try {
    const teacher = await updateTeacher({
      teacherId: req.params.teacherId,
      updateData: req.body,
    });
    res.status(200).json(teacher);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * DELETE /api/v1/teachers/:id
 * Delete a teacher (ADMIN only)
 */
export const deleteTeacherController = async (req, res) => {
  try {
    await deleteTeacher({ teacherId: req.params.teacherId });
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
