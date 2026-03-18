import { USER_ROLES } from '../enums/roles.enum.js';
import User from '../models/user.model.js';
import { clerkClient } from '@clerk/express'; // Use @clerk/express SDK

/**
 * Update a user's role both in DB and Clerk
 * @param {String} clerkId - MongoDB _id of the user
 * @param {String} role - new role ('TEACHER', 'PREFECT' or 'ADMIN')
 */
export const updateUserRole = async ({ clerkId, role }) => {
  if (!Object.values(USER_ROLES).includes(role)) {
    throw new Error('Invalid role');
  }

  const user = await User.findById(clerkId);
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

export const updateUserStatus = async ({ clerkId, status }) => {
  if (!Object.values(USER_STATUS).includes(status)) {
    throw new Error('Invalid status');
  }

  const user = await User.findById(clerkId);
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
