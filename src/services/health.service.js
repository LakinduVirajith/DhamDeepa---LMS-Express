import mongoose from 'mongoose';
import os from 'os';

/**
 * @desc    Returns basic health info
 */
export const getBasicHealthService = () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
  };
};

/**
 * @desc    Returns detailed health info
 * @returns {Promise<Object>}
 */
export const getDetailedHealthService = async () => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();

  return {
    status: 'ok',
    system: {
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    database: {
      status: dbStatus,
    },
    memory: {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
    },
    cpu: {
      loadAverage: os.loadavg(),
    },
    timestamp: new Date(),
  };
};
