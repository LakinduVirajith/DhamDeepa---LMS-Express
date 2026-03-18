import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import 'dotenv/config';

import connectDB from './config/db.js';

// 🔐 Middlewares
import { securityMiddleware } from './middlewares/security.middleware.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';

// 📦 Routes
import userWebhookRoutes from './routes/user.webhook.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import prefectRoutes from './routes/prefect.routes.js';
import competitionRoutes from './routes/competition.routes.js';

const app = express();

// 🔌 DB connect
connectDB();

// 🛡️ Security setup
securityMiddleware(app);

// 🚦 Rate limit all API routes
app.use('/api', apiLimiter);

// 📦 Body parser (limit size)
app.use(express.json({ limit: '10kb' }));

// ⚡ Compress responses
app.use(compression());

// 🧾 Log requests (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 🚏 Routes
app.use('/api/v1/webhooks/users', userWebhookRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/prefects', prefectRoutes);
app.use('/api/v1/competitions', competitionRoutes);

// ❌ Unknown routes
app.all('*', (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl}`,
  });
});

export default app;
