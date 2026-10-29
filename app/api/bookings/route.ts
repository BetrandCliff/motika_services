import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

const schema = z.object({
  serviceSlug: z.string().min(2).max(100),
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.email().max(254),
  customerPhone: z.string().trim().min(7).max(30),
  details: z.string().trim().min(8).max(3000),
  deadline: z.iso.datetime().optional().or(z.literal(""))
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.safeParse(await request.json());
    if (!body.success) return apiError("Please check the booking details and try again.");
    const data = body.data;

    // Honeypot/rate-limiting should also be configured at the edge before production.
    const service = await prisma.service.findFirst({
      where: { slug: data.serviceSlug, active: true }
    });
    if (!service) return apiError("This service is not currently available.", 404);

    const reference = `MOT-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const booking = await prisma.booking.create({
      data: {
        reference,
        serviceId: service.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail.toLowerCase(),
        customerPhone: data.customerPhone,
        details: data.details,
        deadline: data.deadline ? new Date(data.deadline) : null,
        amountXaf: service.priceXaf
      },
      select: { id: true, reference: true, amountXaf: true, currency: true, paymentStatus: true }
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Booking create failed", error);
    return apiError("We could not save the booking. Please try again later.", 500);
  }
}
