import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { initializeFlutterwavePayment } from "@/lib/flutterwave";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

const schema = z.object({ bookingReference: z.string().min(8).max(100) });

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return apiError("A valid booking reference is required.");

    const booking = await prisma.booking.findUnique({
      where: { reference: parsed.data.bookingReference },
      include: { service: true }
    });
    if (!booking) return apiError("Booking not found.", 404);
    if (booking.paymentStatus === "PAID") return apiError("This booking has already been paid.");
    if (booking.amountXaf <= 0) return apiError("The service fee has not been configured yet. Contact Motika to confirm the price.", 409);
    if (booking.paymentStatus === "PENDING" && booking.paymentUrl) {
      return NextResponse.json({ paymentUrl: booking.paymentUrl, bookingReference: booking.reference });
    }

    const txRef = `MOTIKA-${booking.reference}-${randomBytes(5).toString("hex")}`;
    const payment = await initializeFlutterwavePayment({
      txRef,
      amount: booking.amountXaf,
      currency: "XAF",
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      bookingReference: booking.reference,
      serviceName: booking.service.title
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentTxRef: txRef, paymentUrl: payment.link, paymentStatus: "PENDING" }
    });

    return NextResponse.json({ paymentUrl: payment.link, bookingReference: booking.reference });
  } catch (error) {
    console.error("Payment initialize failed", error);
    return apiError("Unable to start payment right now. Please contact Motika if you have been charged.", 502);
  }
}
