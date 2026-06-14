import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'INVALID_JSON' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const subject = (body.subject ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: 'MISSING_FIELDS' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'INVALID_EMAIL' }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? gmailUser;

  if (!gmailUser || !gmailAppPassword) {
    console.warn('[contact] GMAIL_USER o GMAIL_APP_PASSWORD no configuradas. Mensaje:', {
      name,
      email,
      subject,
      message,
    });
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    const html = `
      <div style="font-family: Inter, system-ui, sans-serif; color: #0a0a0a;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; margin: 0 0 16px;">
          Nuevo mensaje desde la web de Brío
        </h2>
        <table cellpadding="6" style="border-collapse: collapse;">
          <tr><td style="color:#666; text-transform:uppercase; font-size:11px; letter-spacing:0.12em;">Nombre</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="color:#666; text-transform:uppercase; font-size:11px; letter-spacing:0.12em;">Email</td><td>${escapeHtml(email)}</td></tr>
          <tr><td style="color:#666; text-transform:uppercase; font-size:11px; letter-spacing:0.12em;">Asunto</td><td>${escapeHtml(subject)}</td></tr>
        </table>
        <h3 style="margin-top:24px; text-transform:uppercase; font-size:11px; letter-spacing:0.12em; color:#666;">Mensaje</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
    `;

    const text = `Nuevo mensaje desde la web de Brío

Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}`;

    await transporter.sendMail({
      from: `"Brío Web" <${gmailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `[Brío Web] ${subject}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Error enviando email', err);
    return NextResponse.json({ ok: false, error: 'SEND_FAILED' }, { status: 502 });
  }
}
