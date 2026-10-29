import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export async function POST(request: NextRequest) {
  const expected = process.env.FLW_SECRET_HASH;
  const provided = request.headers.get("verif-hash") ?? "";
  if (!expected || !provided || !safeEqual(provided, expected)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const payload = await request.json();
    const data = payload?.data;
    if (payload?.event !== "charge.completed" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    const eventKey = `charge.completed:${data.id}:${data.status ?? "unknown"}`;
    try {
      await prisma.processedWebhook.create({ data: { eventKey } });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw error;
    }

    // Do not trust webhook fields alone. Re-query Flutterwave and compare with our stored booking.
    const tx = await verifyFlutterwaveTransaction(data.id);
    const booking = await prisma.booking.findUnique({ where: { paymentTxRef: tx.tx_ref } });
    if (!booking) return NextResponse.json({ received: true });

    const valid = tx.status === "successful"
      && tx.tx_ref === booking.paymentTxRef
      && tx.currency === booking.currency
      && Number(tx.amount) >= booking.amountXaf;

    if (valid && booking.paymentStatus !== "PAID") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "PAID",
          status: booking.status === "PENDING" ? "CONFIRMED" : booking.status,
          flutterwaveId: String(tx.id),
          paidAt: new Date()
        }
      });
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Flutterwave webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
