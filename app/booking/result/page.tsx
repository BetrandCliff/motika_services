"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, XCircle, ArrowUpRight, GraduationCap } from "lucide-react";

function ResultContent() {
  const params = useSearchParams();
  const [state, setState] = useState<"checking"|"success"|"pending"|"failed">("checking");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const status = params.get("status");
    const txId = params.get("transaction_id");
    const txRef = params.get("tx_ref");
    if (!txRef) { setState(status === "cancelled" ? "failed" : "pending"); return; }
    setReference(txRef);
    const bookingReference = txRef.match(/MOTIKA-(MOT-[^-]+-[^-]+)-/)?.[1];
    // tx_ref is generated server-side; use the known booking reference embedded in the reference.
    if (status !== "successful" || !txId || !bookingReference) { setState(status === "cancelled" ? "failed" : "pending"); return; }
    fetch("/api/payments/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: txId, bookingReference })
    }).then(async r => {
      const data = await r.json();
      setState(r.ok && data.verified ? "success" : "pending");
    }).catch(() => setState("pending"));
  }, [params]);

  const content = {
    checking: { icon: Clock3, title: "Verifying your payment", desc: "Please wait while we confirm your transaction with Flutterwave." },
    success: { icon: CheckCircle2, title: "Payment confirmed", desc: "Your payment was verified. Motika can now process your confirmed booking." },
    pending: { icon: Clock3, title: "Payment verification pending", desc: "Your payment may still be processing. Do not pay again yet. Contact Motika with your transaction reference." },
    failed: { icon: XCircle, title: "Payment not completed", desc: "No successful payment was confirmed. You can return to the website or contact Motika for help." }
  }[state];
  const Icon = content.icon;

  return <main className="grid min-h-screen place-items-center bg-cream p-5"><div className="w-full max-w-lg rounded-[2rem] border border-forest/10 bg-white p-8 text-center shadow-soft sm:p-10"><a href="/" className="mx-auto inline-flex items-center gap-2 text-sm font-bold text-forest"><span className="grid h-10 w-10 place-items-center rounded-xl bg-lime"><GraduationCap size={22}/></span> MOTIKA SERVICES</a><span className={`mx-auto mt-8 grid h-16 w-16 place-items-center rounded-full ${state==="success"?"bg-lime text-forest":"bg-cream text-teal"}`}><Icon size={30}/></span><h1 className="mt-5 text-2xl font-semibold text-forest">{content.title}</h1><p className="mt-3 text-sm leading-6 text-ink/60">{content.desc}</p>{reference&&<p className="mt-5 break-all rounded-xl bg-cream p-3 text-xs text-ink/60">Transaction reference: {reference}</p>}<a href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 font-semibold text-white transition hover:bg-teal">Return to website <ArrowUpRight size={16}/></a></div></main>;
}

import { Suspense } from "react";
export default function PaymentResultPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-cream">Checking payment…</div>}><ResultContent/></Suspense>;
}
