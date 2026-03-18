import {
  getBasicHealthService,
  getDetailedHealthService,
} from '../services/health.service.js';

/**
 * GET /health
 * Basic health check (public)
 */
export const basicHealthController = (req, res) => {
  const healthData = getBasicHealthService();
  res.status(200).json(healthData);
};

/**
 * GET /health/details
 * Detailed health check (admin only)
 */
export const detailedHealthController = async (req, res) => {
  const healthData = await getDetailedHealthService();
  res.status(200).json(healthData);
};
