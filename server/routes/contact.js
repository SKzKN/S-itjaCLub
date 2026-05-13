import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { sendEmail } from '../lib/email.js';

export const contactRouter = Router();

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const openCors = cors({ origin: '*' });

const ContactInput = z.object({
  name:    z.string().trim().min(1).max(100),
  email:   z.string().trim().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(5000),
});

contactRouter.options('/', openCors);
contactRouter.post('/', openCors, limiter, async (req, res) => {
  const parsed = ContactInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Vigane sisestus.' });

  const { name, email, subject, message } = parsed.data;
  const subjectLine = subject ? `Kontaktivorm: ${subject}` : `Kontaktivorm — ${name}`;

  try {
    await sendEmail({
      to:      'contact@driversclub.ee',
      subject: subjectLine,
      text:    `Nimi: ${name}\nE-post: ${email}\n\n${message}`,
      html: `
        <p><strong>Nimi:</strong> ${esc(name)}</p>
        <p><strong>E-post:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
        ${subject ? `<p><strong>Teema:</strong> ${esc(subject)}</p>` : ''}
        <p><strong>Sõnum:</strong></p>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('[contact] email failed:', e?.message || e);
    res.status(500).json({ error: 'E-kirja saatmine ebaõnnestus. Proovi uuesti.' });
  }
});

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
