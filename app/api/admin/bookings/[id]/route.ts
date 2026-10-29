import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  adminNotes: z.string().max(3000).optional()
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const booking = await prisma.booking.update({
    where: { id },
    data: parsed.data,
    include: { service: { select: { title: true } } }
  });
  return NextResponse.json({ booking });
}
