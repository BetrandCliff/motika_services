"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ArrowUpRight, GraduationCap } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally { setLoading(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-cream p-5">
    <div className="w-full max-w-md rounded-[2rem] border border-forest/10 bg-white p-8 shadow-soft sm:p-10">
      <a href="/" className="inline-flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-forest"><GraduationCap size={25}/></span><span><strong className="block text-lg text-forest">MOTIKA</strong><span className="text-[10px] font-bold tracking-[.16em] text-teal">ADMIN PORTAL</span></span></a>
      <div className="mt-9"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cream text-teal"><LockKeyhole size={21}/></span><h1 className="mt-4 text-2xl font-semibold text-forest">Welcome back</h1><p className="mt-2 text-sm leading-6 text-ink/60">Sign in to manage bookings and service requests.</p></div>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Admin email</label><input id="email" type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-forest/15 px-4 py-3.5 text-sm"/></div>
        <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Password</label><input id="password" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-forest/15 px-4 py-3.5 text-sm"/></div>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-4 font-bold text-white transition hover:bg-teal disabled:opacity-60">{loading?"Signing in...":"Sign in"} <ArrowUpRight size={17}/></button>
      </form>
      <a href="/" className="mt-6 block text-center text-sm text-teal hover:underline">Back to website</a>
    </div>
  </main>;
}
