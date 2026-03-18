import express from 'express';
import {
  getAllCompetitionsController,
  getCompetitionByIdController,
  createCompetitionController,
  updateCompetitionController,
  deleteCompetitionController,
  addParticipantController,
  removeParticipantController,
} from '../controllers/competition.controller.js';

import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '../enums/roles.enum.js';

const router = express.Router();

// All routes require Clerk auth
router.use(requireAuth);

// CRUD
router.post('/', requireRole(USER_ROLES.TEACHER), createCompetitionController);
router.get('/:id', getCompetitionByIdController);
router.get('/', getAllCompetitionsController);
router.put(
  '/:id',
  requireRole(USER_ROLES.TEACHER),
  updateCompetitionController,
);
router.delete(
  '/:id',
  requireRole(USER_ROLES.TEACHER),
  deleteCompetitionController,
);

// Participants
router.post(
  '/:id/participants',
  requireRole(USER_ROLES.TEACHER, USER_ROLES.PREFECT),
  addParticipantController,
);
router.delete(
  '/:id/participants/:studentId',
  requireRole(USER_ROLES.TEACHER, USER_ROLES.PREFECT),
  removeParticipantController,
);

export default router;
