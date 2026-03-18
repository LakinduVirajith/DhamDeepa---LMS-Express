import express from 'express';
import {
  basicHealthController,
  detailedHealthController,
} from '../controllers/health.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// Public health check (anyone can call)
router.get('/', basicHealthController);

// Detailed health check (admin only)
router.get(
  '/details',
  requireAuth,
  requireRole(USER_ROLES.ADMIN),
  detailedHealthController,
);

export default router;
