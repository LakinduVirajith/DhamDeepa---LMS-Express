import { updateUserRole } from '../services/admin.service.js';

/**
 * PUT /api/v1/admin/user/:clerkId/role
 * Update a user's role
 */
export const updateUserRoleController = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { role } = req.body;

    const updatedTeacher = await updateUserRole({ clerkId, role });

    res.json(updatedTeacher);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

/**
 * PUT /api/v1/admin/user/:clerkId/status
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
