import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const schema = z.object({ email: z.email(), password: z.string().min(1).max(200) });

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json());
    if (!body.success) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });

    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!email || !hash) return NextResponse.json({ error: "Admin account is not configured." }, { status: 503 });

    const valid = body.data.email.toLowerCase() === email && await bcrypt.compare(body.data.password, hash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
