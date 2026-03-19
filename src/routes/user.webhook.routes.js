import express from 'express';
import crypto from 'crypto';
import {
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
} from '../controllers/user.webhook.controller.js';

const router = express.Router();

// Clerk webhook endpoint
router.post(
  '/clerk',
  express.raw({ type: 'application/json' }),
  handleUserWebhook,
);

export default router;

// Verify Clerk HMAC Signature
function verifyClerkSignature(rawBody, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// Webhook handler
async function handleUserWebhook(req, res) {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    const signature = req.headers['x-clerk-signature'];

    if (!verifyClerkSignature(req.body, signature, secret)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Parse the raw JSON body
    const event = JSON.parse(req.body.toString('utf8'));

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
