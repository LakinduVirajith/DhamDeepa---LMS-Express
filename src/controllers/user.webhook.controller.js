import {
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.webhook.service.js';

/**
 * Handles user.created event
 */
export const handleUserCreated = async (clerkUser) => {
  await createUser(clerkUser);
};

/**
 * Handles user.updated event
 */
export const handleUserUpdated = async (clerkUser) => {
  await updateUser(clerkUser);
};

/**
 * Handles user.deleted event
 */
export const handleUserDeleted = async (clerkUser) => {
  await deleteUser(clerkUser.id);
};
