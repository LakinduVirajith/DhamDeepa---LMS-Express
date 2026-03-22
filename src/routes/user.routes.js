import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import {
  getAllUsersController,
  getUserStatsController,
  updateUserRoleController,
  updateUserStatusController,
} from '../controllers/user.controller.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.get('/', requireRole([USER_ROLES.ADMIN]), getAllUsersController);
router.put(
  '/:userId/role',
  requireRole([USER_ROLES.ADMIN]),
  updateUserRoleController,
);
router.put(
  '/:userId/status',
  requireRole([USER_ROLES.ADMIN]),
  updateUserStatusController,
);
router.get('/stats', requireRole([USER_ROLES.ADMIN]), getUserStatsController);

export default router;
