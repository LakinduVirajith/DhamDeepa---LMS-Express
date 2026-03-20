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

  // 🧪 Mongo sanitize
  app.use(mongoSanitize());

  // 🧬 XSS sanitize
  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/api/v1/webhooks') && req.body) {
      const sanitize = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
          else if (typeof obj[key] === 'object') sanitize(obj[key]);
        }
      };
      sanitize(req.body);
    }
    next();
  });

  // 🔀 Prevent duplicate query params
  app.use(hpp());

  // 🚫 Hide Express info
  app.disable('x-powered-by');
};
