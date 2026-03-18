import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

export const securityMiddleware = (app) => {
  // 🔐 Set secure HTTP headers
  app.use(helmet());

  // 🌐 Allow requests only from frontend
  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    }),
  );

  // 🧪 Prevent NoSQL injection (MongoDB)
  app.use(mongoSanitize());

  // 🧬 Prevent XSS (script injection)
  app.use(xss());

  // 🔀 Prevent duplicate query params
  app.use(hpp());

  // 🚫 Hide Express info
  app.disable('x-powered-by');
};
