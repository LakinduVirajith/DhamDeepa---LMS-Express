import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import {
  updateUserRoleController,
  updateUserStatusController,
} from '../controllers/admin.controller.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.put(
  '/user/:clerkId/role',
  requireRole([USER_ROLES.ADMIN]),
  updateUserRoleController,
);

router.put(
  '/user/:clerkId/status',
  requireRole([USER_ROLES.ADMIN]),
  updateUserStatusController,
);

export default router;
