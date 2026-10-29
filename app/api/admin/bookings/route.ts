import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await prisma.booking.findMany({
    include: { service: { select: { title: true, category: true } } },
    orderBy: { createdAt: "desc" },
    take: 300
  });
  return NextResponse.json({ bookings });
}
