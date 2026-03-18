import {
  createPrefectService,
  getPrefectByIdService,
  getAllPrefectsService,
  updatePrefectService,
  deletePrefectService,
} from '../services/prefect.service.js';

/**
 * POST /api/v1/prefects
 * Create a new prefect
 */
export const createPrefectController = async (req, res) => {
  try {
    const prefect = await createPrefectService({
      user: req.user,
      prefectData: req.body,
    });
    res.status(201).json(prefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/v1/prefects/:id
 * Get prefect by ID
 */
export const getPrefectByIdController = async (req, res) => {
  try {
    const prefect = await getPrefectByIdService(req.params.id);
    res.json(prefect);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * GET /api/v1/prefects
 * Get all prefects with pagination, filters, and search
 * Example query:
 * /api/v1/prefects?page=1&limit=10&position=HEAD_PREFECT&status=ACTIVE&search=alice
 */
export const getAllPrefectsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, position, status, search } = req.query;
    const result = await getAllPrefectsService({
      user: req.user,
      page: parseInt(page),
      limit: parseInt(limit),
      position,
      status,
      search,
    });
    res.json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/prefects/:id
 * Update a prefect
 */
export const updatePrefectController = async (req, res) => {
  try {
    const prefect = await updatePrefectService({
      user: req.user,
      prefectId: req.params.id,
      updateData: req.body,
    });
    res.json(prefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /api/v1/prefects/:id
 * Delete a prefect
 */
export const deletePrefectController = async (req, res) => {
  try {
    await deletePrefectService({ user: req.user, prefectId: req.params.id });
    res.json({ message: 'Prefect deleted successfully' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
