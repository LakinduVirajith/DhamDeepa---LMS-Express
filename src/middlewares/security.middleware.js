import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import hpp from 'hpp';

export const securityMiddleware = (app) => {
  // 🔐 Set secure HTTP headers
  app.use(helmet());

  // 🌐 Allow requests only from frontend
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );

  // 🚫 Skip sanitization for webhooks
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/v1/webhooks')) {
      return next();
    }
    next();
  });

  // 🧪 Mongo sanitize
  app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

  // 🧬 XSS protection
  app.use((req, res, next) => {
    if (req.body) {
      req.body = JSON.parse(JSON.stringify(req.body), (key, value) =>
        typeof value === 'string' ? xss(value) : value,
      );
    }
    next();
  });

  // 🔀 Prevent duplicate query params
  app.use(hpp());

  // 🚫 Hide Express info
  app.disable('x-powered-by');
};
