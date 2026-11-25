// POST /api/contact  ->  email the message to the site owner
const express = require('express');
const router = express.Router();

// your routes, e.g.
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello' });
});

module.exports = router;
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Nadeeja Site <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      })
    });
    if (!r.ok) throw new Error(await r.text());
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact email failed:', err);
    res.status(500).json({ error: 'Could not send your message. Please try again.' });
  }
});