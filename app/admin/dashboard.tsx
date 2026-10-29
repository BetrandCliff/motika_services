"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock3, LogOut, RefreshCw, Search, ShieldCheck } from "lucide-react";

type Booking = {
  id: string; reference: string; customerName: string; customerEmail: string; customerPhone: string;
  details: string; amountXaf: number; status: string; paymentStatus: string; createdAt: string;
  adminNotes: string | null; service: { title: string; category: string };
};

const statusOptions = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [saving, setSaving] = useState("");
  const [notes, setNotes] = useState<Record<string,string>>({});

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load bookings.");
      setBookings(data.bookings);
      setNotes(Object.fromEntries(data.bookings.map((b: Booking) => [b.id, b.adminNotes || ""])));
    } catch(e) { setError(e instanceof Error ? e.message : "Could not load bookings."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => bookings.filter(b => {
    const matchesFilter = filter === "ALL" || b.status === filter;
    const needle = query.toLowerCase();
    const matchesQuery = [b.reference,b.customerName,b.customerEmail,b.customerPhone,b.service.title].some(x=>x.toLowerCase().includes(needle));
    return matchesFilter && matchesQuery;
  }), [bookings,filter,query]);

  async function updateBooking(id: string, patch: {status?:string;adminNotes?:string}) {
    setSaving(id); setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setBookings(prev=>prev.map(b=>b.id===id?data.booking:b));
    } catch(e) { setError(e instanceof Error?e.message:"Update failed."); }
    finally { setSaving(""); }
  }

  async function logout() {
    await fetch("/api/admin/logout",{method:"POST"});
    window.location.href="/admin/login";
  }

  const paid = bookings.filter(b=>b.paymentStatus==="PAID");
  const paidTotal = paid.reduce((sum,b)=>sum+b.amountXaf,0);

  return <main className="min-h-screen bg-cream">
    <header className="sticky top-0 z-20 border-b border-forest/10 bg-white/90 backdrop-blur-xl">
      <div className="container-wide flex min-h-[76px] items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-forest"><ShieldCheck size={23}/></span><span><strong className="block text-forest">MOTIKA</strong><span className="text-[10px] font-bold tracking-[.16em] text-teal">ADMIN DASHBOARD</span></span></a>
        <div className="flex items-center gap-2"><button onClick={()=>void load()} className="inline-flex items-center gap-2 rounded-full border border-forest/15 px-4 py-2.5 text-sm font-semibold text-forest hover:bg-cream"><RefreshCw size={15}/> <span className="hidden sm:inline">Refresh</span></button><button onClick={()=>void logout()} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal"><LogOut size={15}/> <span className="hidden sm:inline">Sign out</span></button></div>
      </div>
    </header>
    <div className="container-wide py-8 sm:py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-teal">OVERVIEW</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest sm:text-4xl">Booking management</h1><p className="mt-2 text-sm text-ink/60">Review customer requests, track payment status and update progress.</p></div><p className="text-xs text-ink/45">Showing latest 300 requests</p></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {label:"Total bookings",value:String(bookings.length),icon:Clock3},
          {label:"Paid bookings",value:String(paid.length),icon:CheckCircle2},
          {label:"Awaiting payment",value:String(bookings.filter(b=>b.paymentStatus!=="PAID"&&b.paymentStatus!=="FAILED").length),icon:Clock3},
          {label:"Confirmed revenue",value:`${paidTotal.toLocaleString("fr-FR")} XAF`,icon:ArrowUpRight}
        ].map((stat,i)=><motion.div key={stat.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.06}} className="rounded-2xl border border-forest/10 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm text-ink/60">{stat.label}</span><stat.icon size={19} className="text-teal"/></div><p className="mt-4 text-2xl font-semibold tracking-tight text-forest">{stat.value}</p></motion.div>)}
      </div>
      <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, reference, service..." className="w-full rounded-full border border-forest/10 bg-cream/60 py-3 pl-11 pr-4 text-sm"/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-full border border-forest/10 bg-white px-4 py-3 text-sm"><option value="ALL">All statuses</option>{statusOptions.map(s=><option key={s}>{s}</option>)}</select>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? <div className="py-16 text-center text-sm text-ink/50">Loading bookings…</div> : filtered.length===0 ? <div className="py-16 text-center"><p className="font-semibold text-forest">No bookings found</p><p className="mt-2 text-sm text-ink/50">New requests will appear here when customers submit the booking form.</p></div> :
        <div className="mt-5 space-y-4">
          <AnimatePresence>{filtered.map((b,i)=><motion.article key={b.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:Math.min(i*.02,.2)}} className="rounded-2xl border border-forest/10 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-teal">{b.reference}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${b.paymentStatus==="PAID"?"bg-lime/50 text-forest":"bg-amber-50 text-amber-800"}`}>{b.paymentStatus}</span><span className="text-xs text-ink/45">{new Date(b.createdAt).toLocaleString()}</span></div><h2 className="mt-3 text-lg font-semibold text-forest">{b.service.title}</h2><p className="mt-1 text-sm text-ink/60">{b.customerName} · {b.customerEmail} · {b.customerPhone}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/75">{b.details}</p><p className="mt-3 text-sm font-bold text-forest">{b.amountXaf.toLocaleString("fr-FR")} XAF</p></div>
              <div className="grid gap-3 sm:grid-cols-2 xl:w-64 xl:grid-cols-1">
                <div><label className="mb-1.5 block text-xs font-semibold text-ink/60">Booking status</label><select value={b.status} disabled={saving===b.id} onChange={e=>void updateBooking(b.id,{status:e.target.value})} className="w-full rounded-xl border border-forest/10 bg-white px-3 py-2.5 text-sm">{statusOptions.map(s=><option key={s}>{s}</option>)}</select></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-ink/60">Internal notes</label><textarea rows={2} value={notes[b.id]??""} onChange={e=>setNotes(prev=>({...prev,[b.id]:e.target.value}))} className="w-full rounded-xl border border-forest/10 px-3 py-2.5 text-sm" placeholder="Internal notes..."/><button disabled={saving===b.id} onClick={()=>void updateBooking(b.id,{adminNotes:notes[b.id]??""})} className="mt-2 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{saving===b.id?"Saving...":"Save notes"}</button></div>
              </div>
            </div>
          </motion.article>)}</AnimatePresence>
        </div>}
      </div>
    </div>
  </main>;
}
