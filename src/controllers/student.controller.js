import {
  getStudents,
  createStudentService,
  updateStudentService,
  deleteStudentService,
  getStudentByIdService,
} from '../services/student.service.js';

/**
 * POST /api/v1/students
 * Create a new student (TEACHER only)
 */
export const createStudent = async (req, res) => {
  try {
    const student = await createStudentService({
      user: req.user,
      studentData: req.body,
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/students/:id
 * Get a student by ID
 */
export const getSelectedStudent = async (req, res) => {
  try {
    const student = await getStudentByIdService(req.params.id);
    res.json(student);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * GET /api/v1/students
 * Get all students with pagination, optional filters, and search
 * Example query: /api/v1/students?page=1&limit=10&teacherId=xxx&grade=Grade 5&search=John
 */
export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { teacherId, grade, search } = req.query;

    const result = await getStudents({
      user: req.user,
      page,
      limit,
      teacherId,
      grade,
      search,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * PUT /api/v1/students/:id
 * Update a student (TEACHER only)
 */
export const updateStudent = async (req, res) => {
  try {
    const student = await updateStudentService({
      user: req.user,
      studentId: req.params.id,
      updateData: req.body,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/v1/students/:id
 * Delete a student (TEACHER only)
 */
export const deleteStudent = async (req, res) => {
  try {
    await deleteStudentService({ user: req.user, studentId: req.params.id });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
