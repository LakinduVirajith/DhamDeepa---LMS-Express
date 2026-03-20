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
    clerkUser.primary_email_address || // normal email signup
    clerkUser.email_addresses?.find(
      (e) => e.verification?.status === 'verified',
    )?.email_address || // OAuth signup
    clerkUser.external_accounts?.find((e) => e.email_address_verified)
      ?.email_address || // fallback
    null;

  if (!email) {
    throw new Error('User email not found');
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
    clerkUser.email_addresses?.find(
      (e) => e.verification?.status === 'verified',
    )?.email_address ||
    clerkUser.external_accounts?.find((e) => e.email_address_verified)
      ?.email_address ||
    user.email;

  user.firstName = clerkUser.first_name ?? user.firstName;
  user.lastName = clerkUser.last_name ?? user.lastName;
  user.email = email;
  user.role = clerkUser.public_metadata.role;
  user.status = clerkUser.public_metadata.status;

  await user.save();

  // Sync metadata after update
  await clerkClient.users.updateUser(clerkUser.id, {
    publicMetadata: {
      role: clerkUser.public_metadata.role,
      status: clerkUser.public_metadata.status,
    },
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
