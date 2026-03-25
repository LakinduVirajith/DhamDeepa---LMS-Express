import {
  getAllUsers,
  getUserById,
  getUserStats,
  updateUserRole,
  updateUserStatus,
} from '../services/user.service.js';

/**
 * GET /api/v1/users/:userId
 * Get a user by ID
 */
export const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/v1/users
 * Get all users
 */
export const getAllUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let { role, status, search } = req.query;

    const users = await getAllUsers({
      page,
      limit,
      role,
      status,
      search,
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/users/:clerkId/role
 * Update a user's role
 */
export const updateUserRoleController = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { role } = req.body;

    const updatedUser = await updateUserRole({ clerkId, role });

    res.json(updatedUser);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/users/:clerkId/status
 * Update a user's status
 */
export const updateUserStatusController = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { status } = req.body;

    const updatedUser = await updateUserStatus({ clerkId, status });

    res.json(updatedUser);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * GET /api/v1/stats
 * Get user stats
 */
export const getUserStatsController = async (req, res) => {
  try {
    const stats = await getUserStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
