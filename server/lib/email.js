import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const FROM   = process.env.FROM_EMAIL || 'Drivers Club <onboarding@resend.dev>';
const resend = apiKey ? new Resend(apiKey) : null;

const ET_MONTHS = [
  'jaanuar','veebruar','märts','aprill','mai','juuni',
  'juuli','august','september','oktoober','november','detsember',
];

export async function sendEmail({ to, subject, text, html }) {
  if (!resend) {
    console.log('[email:dev] RESEND_API_KEY not set — would send:');
    console.log('  to:', to);
    console.log('  subject:', subject);
    console.log('  text:\n' + text);
    return { id: 'dev-stub', dev: true };
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, text, html });
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('[email] send failed:', e?.message || e);
    throw e;
  }
}

export function cruiseConfirmationEmail({ user, cruise }) {
  const date = `${cruise.day}. ${ET_MONTHS[(cruise.month || 1) - 1]} ${cruise.year || new Date(cruise.event_date).getUTCFullYear()}`;
  const startLine = cruise.start_place
    ? `${cruise.start_place}${cruise.start_time ? ' kell ' + cruise.start_time : ''}`
    : 'Täpsustub';

  const text =
`Tere ${user.first_name}!

Oled registreeritud sõidule "${cruise.name}".

Kuupäev: ${date}
Marsruut: ${cruise.route}
Kogunemine: ${startLine}

Kui sul on küsimusi või soovid registreeringu tühistada, vasta sellele e-kirjale või kirjuta contact@driversclub.ee.

Driven by Passion. United by Legacy.
Drivers Club`;

  const html = `<!doctype html>
<html lang="et"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#142019;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#F4F1EA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#142019;">
    <tr><td align="center" style="padding:48px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#1F3A2E;border:1px solid rgba(163,143,109,0.35);">
        <tr><td style="padding:40px 40px 0;">
          <p style="margin:0;color:#A38F6D;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;">Drivers Club · Registreerimine kinnitatud</p>
          <h1 style="margin:24px 0 8px;color:#F4F1EA;font-size:32px;font-weight:300;letter-spacing:-0.03em;line-height:1.1;">${escapeHtml(cruise.name)}</h1>
          ${cruise.subtitle ? `<p style="margin:0 0 32px;color:#A38F6D;font-size:14px;font-style:italic;">${escapeHtml(cruise.subtitle)}</p>` : '<div style="height:32px"></div>'}
        </td></tr>
        <tr><td style="padding:0 40px;">
          <p style="margin:0 0 24px;color:#F4F1EA;font-size:15px;line-height:1.7;">Tere <strong>${escapeHtml(user.first_name)}</strong>, sinu koht on broneeritud.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid rgba(163,143,109,0.35);border-bottom:1px solid rgba(163,143,109,0.35);">
            <tr><td style="padding:18px 0;border-bottom:1px solid rgba(163,143,109,0.35);">
              <div style="color:#A38F6D;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">Kuupäev</div>
              <div style="color:#F4F1EA;font-size:15px;margin-top:4px;">${escapeHtml(date)}</div>
            </td></tr>
            <tr><td style="padding:18px 0;border-bottom:1px solid rgba(163,143,109,0.35);">
              <div style="color:#A38F6D;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">Marsruut</div>
              <div style="color:#F4F1EA;font-size:15px;margin-top:4px;">${escapeHtml(cruise.route)}</div>
            </td></tr>
            <tr><td style="padding:18px 0;">
              <div style="color:#A38F6D;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">Kogunemine</div>
              <div style="color:#F4F1EA;font-size:15px;margin-top:4px;">${escapeHtml(startLine)}</div>
            </td></tr>
          </table>
          <p style="margin:32px 0 8px;color:#F4F1EA;font-size:14px;line-height:1.7;">Kui sul on küsimusi või soovid registreeringu tühistada, kirjuta meile.</p>
          <p style="margin:0 0 40px;"><a href="mailto:contact@driversclub.ee" style="color:#A38F6D;text-decoration:underline;font-size:14px;">contact@driversclub.ee</a></p>
        </td></tr>
        <tr><td style="padding:0 40px 40px;border-top:1px solid rgba(163,143,109,0.35);">
          <p style="margin:24px 0 0;color:#A38F6D;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-weight:600;">Driven by Passion · United by Legacy</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return {
    subject: `Registreerimine kinnitatud — ${cruise.name}`,
    text,
    html,
  };
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
