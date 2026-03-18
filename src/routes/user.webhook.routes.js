import express from 'express';
import {
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
} from '../controllers/user.webhook.controller.js';

const router = express.Router();

// Clerk webhook endpoint
router.post('/clerk', handleUserWebhook);

export default router;

// Main handler routing by event type
async function handleUserWebhook(req, res) {
  try {
    // Check the secret header
    const secretHeader = req.headers['x-clerk-webhook-secret'];
    if (secretHeader !== process.env.CLERK_WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = req.body;

    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
      default:
        // ignore other events
        break;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
