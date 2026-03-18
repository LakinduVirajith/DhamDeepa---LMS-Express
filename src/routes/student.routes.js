import express from 'express';
import {
  createStudent,
  getAllStudents,
  getSelectedStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.post('/', requireRole([USER_ROLES.TEACHER]), createStudent);
router.get(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.TEACHER]),
  getAllStudents,
);
router.get(
  '/:id',
  getSelectedStudent,
  requireRole([USER_ROLES.ADMIN, USER_ROLES.TEACHER]),
);
router.put('/:id', requireRole([USER_ROLES.TEACHER]), updateStudent);
router.delete('/:id', requireRole([USER_ROLES.TEACHER]), deleteStudent);

export default router;
