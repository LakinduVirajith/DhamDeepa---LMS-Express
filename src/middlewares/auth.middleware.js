import { requireAuth as clerkRequireAuth } from '@clerk/express';
import User from '../models/user.model.js';

// 🔑 Wrap Clerk auth and add DB user to request
export const requireAuth = [
  clerkRequireAuth(), // Clerk auth
  async (req, res, next) => {
    try {
      console.log('--- requireAuth middleware ---');

      // Step 1: Check Clerk auth
      if (!req.auth || !req.auth.userId) {
        console.log('❌ req.auth missing or userId missing');
        return res.status(403).json({ message: 'Unauthorized: No Clerk auth' });
      }
      console.log('✅ Clerk auth found:', req.auth.userId);

      // Step 2: Lookup DB user
      const user = await User.findOne({ clerkId: req.auth.userId });
      if (!user) {
        console.log(`❌ No DB user found for clerkId ${req.auth.userId}`);
        return res
          .status(403)
          .json({ message: 'Unauthorized: User not in DB' });
      }
      console.log('✅ DB user found:', {
        id: user._id,
        role: user.role,
        status: user.status,
      });

      // Step 3: Attach user to request
      req.user = user;
      next();
    } catch (err) {
      console.error('💥 requireAuth error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

// 👤 Role-based middleware with logs
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    console.log('--- requireRole middleware ---');
    if (!req.user) {
      console.log('❌ req.user missing');
      return res
        .status(403)
        .json({ message: 'Unauthorized: req.user missing' });
    }
    console.log('✅ req.user exists:', { role: req.user.role });

    if (!roles.includes(req.user.role)) {
      console.log(
        `❌ User role ${req.user.role} not allowed. Required: ${roles}`,
      );
      return res.status(403).json({ message: 'Forbidden: Role not allowed' });
    }

    console.log('✅ User role allowed');
    next();
  };
};
