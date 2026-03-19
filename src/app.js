import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import 'dotenv/config';

import connectDB from './config/db.js';

// 🔐 Middlewares
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { securityMiddleware } from './middlewares/security.middleware.js';

// 📦 Routes
import healthRoutes from './routes/health.routes.js';
import userWebhookRoutes from './routes/user.webhook.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import prefectRoutes from './routes/prefect.routes.js';
import competitionRoutes from './routes/competition.routes.js';
import contactRoutes from './routes/contact.routes.js';

const app = express();

// 🌐 Trust proxy headers (needed on Render / Heroku / Vercel)
app.set('trust proxy', 1);

// 🔌 DB connect
connectDB();

// 🛡️ Security setup
securityMiddleware(app);

// 🔗 Webhook route BEFORE body parser
app.use('/api/v1/webhooks/users', userWebhookRoutes);

// 🚦 Rate limit all API routes
app.use('/api', apiLimiter);

// 📦 Body parser (limit size)
app.use(express.json({ limit: '10kb' }));

// ⚡ Compress responses
app.use(compression());

// 🧾 Log requests (dev only)
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

// ❤️‍🩹 Public health route
app.use('/health', healthRoutes);

// 🚏 Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/prefects', prefectRoutes);
app.use('/api/v1/competitions', competitionRoutes);
app.use('/api/contact', contactRoutes);

// ❌ Unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}`,
  });
});

export default app;
