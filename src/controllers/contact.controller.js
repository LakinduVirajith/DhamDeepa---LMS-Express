import { sendContactEmail } from '../services/contact.service.js';

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await sendContactEmail({ name, email, message });
    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
