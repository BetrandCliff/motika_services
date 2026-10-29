import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  subject: z.string().trim().min(3).max(150).regex(/^[^\r\n]+$/),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional()
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check your message details and try again." }, { status: 400 });
    }

    const { name, email, subject, message, website } = parsed.data;
    if (website) return NextResponse.json({ ok: true });

    const user = process.env.GMAIL_USER;
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    const recipient = process.env.CONTACT_EMAIL;
    if (!user || !appPassword || !recipient) {
      return NextResponse.json({ error: "Email is not configured yet. Please contact Motika by WhatsApp." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: appPassword }
    });

    await transporter.sendMail({
      from: `"Motika website" <${user}>`,
      to: recipient,
      replyTo: { name, address: email },
      subject: `Website contact: ${subject}`,
      text: `From: ${name}\nEmail: ${email}\n\n${message}`
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact message delivery failed", error);
    return NextResponse.json({ error: "We could not send your message. Please try again or contact Motika by WhatsApp." }, { status: 502 });
  }
}
