import { USER_ROLES } from '../enums/roles.enum.js';
import { USER_STATUS } from '../enums/status.enum.js';
import User from '../models/user.model.js';
import { clerkClient } from '@clerk/express';

/**
 * Get all users with pagination, filters, and search
 * @param {Number} options.page - page number (default 1)
 * @param {Number} options.limit - items per page (default 10)
 * @param {String} options.role - optional filter by role
 * @param {String} options.status - optional filter by status
 * @param {String} options.search - optional search by name or email
 *
 * @returns {Object} Paginated users result
 */
export const getAllUsers = async ({
  page = 1,
  limit = 10,
  role,
  status,
  search,
}) => {
  if (role && !Object.values(USER_ROLES).includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (status && !Object.values(USER_STATUS).includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const skip = (page - 1) * limit;
  const filter = {};

  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return { users, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Get user stats
 * @returns {Object} User stats
 */
export const getUserStats = async () => {
  const stats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: 'count' }],

        byRole: [
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],

        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const result = stats[0];

  // Helper function
  const getCount = (arr, key) =>
    arr.find((item) => item._id === key)?.count || 0;

  return {
    totalUsers: result.totalUsers[0]?.count || 0,

    roles: {
      admin: getCount(result.byRole, USER_ROLES.ADMIN),
      teacher: getCount(result.byRole, USER_ROLES.TEACHER),
      prefect: getCount(result.byRole, USER_ROLES.PREFECT),
    },

    status: {
      active: getCount(result.byStatus, USER_STATUS.ACTIVE),
      inactive: getCount(result.byStatus, USER_STATUS.INACTIVE),
    },
  };
};

/**
 * Get a user by ID
 * @param {String} userId - user ID
 *
 * @returns {Object} User
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

/**
 * Update a user's role both in DB and Clerk
 * @param {String} userId - MongoDB _id of the user
 * @param {String} role - new role ('TEACHER', 'STUDENT', 'ADMIN')
 */
export const updateUserRole = async ({ userId, role }) => {
  if (!Object.values(USER_ROLES).includes(role)) {
    throw new Error('Invalid role');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.role = role;
  await user.save();

  // Update Clerk public metadata
  if (user.clerkId) {
    await clerkClient.users.updateUser(user.clerkId, {
      publicMetadata: { role, status: user.status },
    });
  }

  return user;
};

/**
 * Update a user's status both in DB and Clerk
 * @param {String} userId - MongoDB _id of the user
 * @param {String} status - new status ('ACTIVE' or 'INACTIVE')
 */
export const updateUserStatus = async ({ userId, status }) => {
  if (!Object.values(USER_STATUS).includes(status)) {
    throw new Error('Invalid status');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.status = status;
  await user.save();

  // Update Clerk public metadata
  if (user.clerkId) {
    await clerkClient.users.updateUser(user.clerkId, {
      publicMetadata: { role: user.role, status },
    });
  }

  return user;
};
