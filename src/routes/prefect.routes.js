import express from 'express';
import {
  createPrefectController,
  getPrefectByIdController,
  getAllPrefectsController,
  updatePrefectController,
  deletePrefectController,
} from '../controllers/prefect.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

router.post(
  '/',
  requireRole(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  createPrefectController,
);
router.get('/', getAllPrefectsController);
router.get('/:id', getPrefectByIdController);
router.put(
  '/:id',
  requireRole(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  updatePrefectController,
);
router.delete(
  '/:id',
  requireRole(USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  deletePrefectController,
);

export default router;
