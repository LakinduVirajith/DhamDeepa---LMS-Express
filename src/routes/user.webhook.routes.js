import express from 'express';
import { Webhook } from 'svix';
import {
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
} from '../controllers/user.webhook.controller.js';

const router = express.Router();

// Clerk webhook endpoint (raw body REQUIRED)
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  handleUserWebhook,
);

export default router;

// Webhook handler
async function handleUserWebhook(req, res) {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    // Initialize Svix webhook verifier
    const wh = new Webhook(secret);

    // Verify + parse event
    const event = wh.verify(req.body.toString(), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });

    // Handle events
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;

      case 'user.updated':
        await handleUserUpdated(event.data);
        break;

      case 'user.deleted':
        await handleUserDeleted(event.data.id);
        break;

      default:
        console.log('Ignoring webhook type:', event.type);
        break;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ message: err.message });
  }
}
