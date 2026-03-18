import {
  getAllCompetitionsService,
  getCompetitionByIdService,
  createCompetitionService,
  updateCompetitionService,
  deleteCompetitionService,
  addParticipantService,
  removeParticipantService,
} from '../services/competition.service.js';

/**
 * POST /api/v1/competitions
 * Create a new competition
 */
export const createCompetitionController = async (req, res) => {
  try {
    const data = await createCompetitionService(req.body, req.user);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/competitions/:id
 * Get a single competition by ID
 */
export const getCompetitionByIdController = async (req, res) => {
  try {
    const data = await getCompetitionByIdService(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * GET /api/v1/competitions
 * Get all competitions with pagination, filters, sorting, and search
 * Example: /api/v1/competitions?page=1&limit=10&year=2025&sort=desc&search=sports
 */
export const getAllCompetitionsController = async (req, res) => {
  try {
    const { page, limit, year, sort, search } = req.query;

    const result = await getAllCompetitionsService({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      year,
      sort,
      search,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/competitions/:id
 * Update an existing competition by ID
 */
export const updateCompetitionController = async (req, res) => {
  try {
    const data = await updateCompetitionService(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * POST /api/v1/competitions/:id/participants
 * Add a student to a competition
 */
export const deleteCompetitionController = async (req, res) => {
  try {
    await deleteCompetitionService(req.params.id);
    res.json({ message: 'Competition deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * POST /api/v1/competitions/:id/participants
 * Add a student to a competition
 */
export const addParticipantController = async (req, res) => {
  try {
    const data = await addParticipantService(
      req.params.id,
      req.params.studentId,
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/v1/competitions/:id/participants/:studentId
 * Remove a student from a competition
 */
export const removeParticipantController = async (req, res) => {
  try {
    const data = await removeParticipantService(
      req.params.id,
      req.params.studentId,
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
