import { requireAuth as clerkRequireAuth } from '@clerk/express';
import User from '../models/user.model.js';

// 🔑 Wrap Clerk auth and add DB user to request
export const requireAuth = [
  clerkRequireAuth(), // Clerk auth
  async (req, res, next) => {
    try {
      const user = await User.findOne({ clerkId: req.auth.userId });
      if (!user) return res.status(403).json({ message: 'Unauthorized' });

      req.user = user; // attach user to request
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
];

// 👤 Role-based middleware
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
