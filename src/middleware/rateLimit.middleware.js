import rateLimit from 'express-rate-limit';

// 🌍 Protect all API routes
export const apiLimiter = rateLimit({
  max: 100, // max requests
  windowMs: 15 * 60 * 1000, // 15 min
  message: 'Too many requests, try again later',
});
