import User from '../models/user.model.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Create user in DB when signup
 * @param {Object} clerkUser - Clerk user object
 */
export const createUser = async (clerkUser) => {
  if (!clerkUser.primary_email_address) {
    throw new Error('Cannot create user: email is missing');
  }

  const newUser = new User({
    clerkId: clerkUser.id,
    firstName: clerkUser.first_name,
    lastName: clerkUser.last_name,
    email: clerkUser.primary_email_address,
  });

  const user = await newUser.save();

  // Add role to Clerk public metadata
  await clerkClient.users.updateUser(clerkUser.id, {
    publicMetadata: { role: user.role, status: user.status },
  });

  return user;
};

/**
 * Update user in DB when Clerk sends update
 * @param {Object} clerkUser - Clerk user object
 */
export const updateUser = async (clerkUser) => {
  const user = await User.findOne({ clerkId: clerkUser.id });
  if (!user) return null;

  user.firstName = clerkUser.first_name ?? user.firstName;
  user.lastName = clerkUser.last_name ?? user.lastName;
  user.email = clerkUser.primary_email_address ?? user.email;

  await user.save();
  return user;
};

/**
 * Delete user in DB
 * @param {Object} clerkUserId - Clerk user id
 */
export const deleteUser = async (clerkId) => {
  const user = await User.findOne({ clerkId });
  if (!user) return null;

  await user.remove();
  return true;
};
