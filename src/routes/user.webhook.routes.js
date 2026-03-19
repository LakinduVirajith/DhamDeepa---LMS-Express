import express from 'express';
import { Webhook } from '@clerk/clerk-sdk-node';
import {
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
} from '../controllers/user.webhook.controller.js';

const router = express.Router();

// Use raw body to verify Clerk signature
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  handleUserWebhook,
);

export default router;

async function handleUserWebhook(req, res) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    // Clerk verification
    const event = Webhook.verify(req.body, req.headers, webhookSecret);

    // event is already parsed JSON
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
