import User from '../models/user.model.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Create user in DB when signup
 * @param {Object} clerkUser - Clerk user object
 */
export const createUser = async (clerkUser) => {
  console.log(
    '🟢 [WEBHOOK] user.created payload:',
    JSON.stringify(clerkUser, null, 2),
  );

  const email =
    clerkUser.primary_email_address ||
    clerkUser.email_addresses?.find((e) => e.verified)?.email_address ||
    clerkUser.emails?.find((e) => e.verified)?.email_address ||
    null;

  if (!email) {
    throw new Error('Cannot create user: email is missing');
  }

  const newUser = new User({
    clerkId: clerkUser.id,
    firstName: clerkUser.first_name || '',
    lastName: clerkUser.last_name || '',
    email,
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

  const email =
    clerkUser.primary_email_address ||
    clerkUser.emails?.find((e) => e.verified)?.email_address ||
    user.email;

  user.firstName = clerkUser.first_name ?? user.firstName;
  user.lastName = clerkUser.last_name ?? user.lastName;
  user.email = email;

  await user.save();

  // Sync metadata after update
  await clerkClient.users.updateUser(clerkUser.id, {
    publicMetadata: { role: user.role, status: user.status },
  });

  return user;
};

/**
 * Delete user in DB
 * @param {Object} clerkUserId - Clerk user id
 */
export const deleteUser = async (clerkId) => {
  const user = await User.findOne({ clerkId });
  if (!user) return false;

  await user.remove();
  return true;
};
