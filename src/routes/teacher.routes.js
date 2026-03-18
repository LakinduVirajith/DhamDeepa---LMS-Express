import express from 'express';
import {
  getAllTeachersController,
  getTeacherByIdController,
  createTeacherController,
  updateTeacherController,
  deleteTeacherController,
} from '../controllers/teacher.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.post('/', requireRole([USER_ROLES.ADMIN]), createTeacherController);
router.get('/:id', getTeacherByIdController);
router.get('/', requireRole([USER_ROLES.ADMIN]), getAllTeachersController);
router.put('/:id', requireRole([USER_ROLES.ADMIN]), updateTeacherController);
router.delete('/:id', requireRole([USER_ROLES.ADMIN]), deleteTeacherController);

export default router;
