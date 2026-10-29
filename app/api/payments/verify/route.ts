import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";

export const runtime = "nodejs";

const schema = z.object({
  transactionId: z.union([z.string().min(1).max(40), z.number().int().positive()]),
  bookingReference: z.string().min(8).max(100)
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid payment verification request.");
    const { transactionId, bookingReference } = parsed.data;
    const booking = await prisma.booking.findUnique({ where: { reference: bookingReference } });
    if (!booking) return apiError("Booking not found.", 404);

    const tx = await verifyFlutterwaveTransaction(transactionId);
    const valid = tx.status === "successful"
      && tx.tx_ref === booking.paymentTxRef
      && tx.currency === booking.currency
      && Number(tx.amount) >= booking.amountXaf;

    if (!valid) {
      return NextResponse.json({ verified: false, paymentStatus: booking.paymentStatus }, { status: 200 });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "PAID",
        status: booking.status === "PENDING" ? "CONFIRMED" : booking.status,
        flutterwaveId: String(tx.id),
        paidAt: booking.paidAt ?? new Date()
      }
    });

    return NextResponse.json({ verified: true, paymentStatus: "PAID", bookingReference });
  } catch (error) {
    console.error("Payment verification failed", error);
    return apiError("Could not verify payment yet. Refresh later or contact Motika.", 502);
  }
}
