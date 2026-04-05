import helmet from 'helmet';
import cors from 'cors';
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
  app.use((req, res, next) => {
    const sanitize = (obj) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key in obj) {
        const safeKey = key.replace(/\$/g, '_').replace(/\./g, '_');

        if (safeKey !== key) {
          obj[safeKey] = obj[key];
          delete obj[key];
        }

        if (typeof obj[safeKey] === 'object') {
          sanitize(obj[safeKey]);
        }
      }
    };

    sanitize(req.body);
    next();
  });

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
