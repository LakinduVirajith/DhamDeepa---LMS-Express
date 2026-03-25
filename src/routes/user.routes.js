import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import {
  getAllUsersController,
  getUserByIdController,
  getUserStatsController,
  updateUserRoleController,
  updateUserStatusController,
} from '../controllers/user.controller.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.get('/', requireRole([USER_ROLES.ADMIN]), getAllUsersController);
router.get('/:userId', requireRole([USER_ROLES.ADMIN]), getUserByIdController);
router.put(
  '/:clerkId/role',
  requireRole([USER_ROLES.ADMIN]),
  updateUserRoleController,
);
router.put(
  '/:clerkId/status',
  requireRole([USER_ROLES.ADMIN]),
  updateUserStatusController,
);
router.get('/stats', requireRole([USER_ROLES.ADMIN]), getUserStatsController);

export default router;
