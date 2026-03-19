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
      origin: process.env.CLIENT_URL,
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );

  // 🔀 Prevent duplicate query params
  app.use(hpp());

  // 🚫 Hide Express info
  app.disable('x-powered-by');

  // 🧪 Body sanitizers (apply only to routes that send data)
  // Prevents MongoDB NoSQL injection and XSS attacks
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/v1/webhooks')) {
      return next();
    }

    const method = req.method.toUpperCase();
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      mongoSanitize()(req, res, () => {
        xss()(req, res, next);
      });
    } else {
      next();
    }
  });
};
