import express from 'express';
import {
  getAllTeachersController,
  getTeacherByIdController,
  createTeacherController,
  updateTeacherController,
  deleteTeacherController,
  getTeacherByClerkIdController,
} from '../controllers/teacher.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.post('/', requireRole([USER_ROLES.TEACHER]), createTeacherController);
router.get(
  '/:teacherId',
  requireRole([USER_ROLES.ADMIN]),
  getTeacherByIdController,
);
router.get(
  '/clerk/:clerkId',
  requireRole([USER_ROLES.TEACHER]),
  getTeacherByClerkIdController,
);
router.get('/', requireRole([USER_ROLES.ADMIN]), getAllTeachersController);
router.patch(
  '/:teacherId',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.TEACHER]),
  updateTeacherController,
);
router.delete(
  '/:teacherId',
  requireRole([USER_ROLES.ADMIN]),
  deleteTeacherController,
);

export default router;
