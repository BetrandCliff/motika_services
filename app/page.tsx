"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronDown,
  Clock3, FileCheck2, GraduationCap, Menu, MessageCircle, PackageCheck,
  ShieldCheck, Sparkles, X, Globe2, ContactRound, Mail
} from "lucide-react";

const services = [
  { category: "University", icon: GraduationCap, title: "UB Online Registration", desc: "Undergraduate and postgraduate registration support." },
  { category: "University", icon: FileCheck2, title: "Clearances & Attestations", desc: "Clearances, school attendance, results and completion of studies." },
  { category: "University", icon: Clock3, title: "Urgent Transcript", desc: "Guidance and follow-up for time-sensitive transcript requests." },
  { category: "Documents", icon: BadgeCheck, title: "Result Confirmation", desc: "Assistance with official confirmation of academic results." },
  { category: "Documents", icon: Globe2, title: "WES & Overseas Mailing", desc: "WES verification assistance and mailing documents abroad." },
  { category: "Documents", icon: FileCheck2, title: "Certificate Collection", desc: "Support with certificate collection from UB or GCE Board." },
  { category: "Identity", icon: ContactRound, title: "ID & Passport Assistance", desc: "Guidance for national identity cards and biometric passports." },
  { category: "Other", icon: PackageCheck, title: "Certification & Errands", desc: "Document certification, nationality procedures and school errands." }
];

const categories = ["All", "University", "Documents", "Identity", "Other"];

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");
  const visibleServices = filter === "All" ? services : services.filter(s => s.category === filter);

  async function sendContactMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSending(true);
    setContactSent(false);
    setContactError("");

    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("contact-name"),
          email: fields.get("contact-email"),
          subject: fields.get("contact-subject"),
          message: fields.get("contact-message"),
          website: fields.get("website")
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message.");
      form.reset();
      setContactSent(true);
    } catch (error) {
      setContactError(error instanceof Error ? error.message : "Unable to send your message. Please try again.");
    } finally {
      setContactSending(false);
    }
  }

  function openBooking(service = "") {
    setSelectedService(service);
    setSubmitted(false);
    setBookingOpen(true);
  }

  return (
    <main className="overflow-hidden">
      <div className="bg-forest text-white text-xs sm:text-sm">
        <div className="container-wide flex min-h-10 items-center justify-between gap-3">
          <p className="flex items-center gap-2"><Sparkles size={14} className="text-lime" /> Reliable support for school and document errands</p>
          <a href="tel:+237675390251" className="hidden sm:inline-flex items-center gap-2 text-lime hover:text-white transition-colors">
            <MessageCircle size={14} /> +237 675 390 251
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/90 backdrop-blur-xl">
        <div className="container-wide flex h-[76px] items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Motika home">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-forest"><GraduationCap size={25} /></span>
            <span className="leading-tight"><strong className="block text-lg tracking-tight text-forest">MOTIKA</strong><span className="text-[10px] font-bold tracking-[.18em] text-teal">SERVICES ULTRA FAST</span></span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a className="text-sm text-ink/75 transition hover:text-teal" href="#services">Services</a>
            <a className="text-sm text-ink/75 transition hover:text-teal" href="#how-it-works">How it works</a>
            <a className="text-sm text-ink/75 transition hover:text-teal" href="#about">About</a>
            <a className="text-sm text-ink/75 transition hover:text-teal" href="#contact">Contact</a>
          </nav>
          <button onClick={() => openBooking()} className="hidden items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal hover:shadow-soft md:inline-flex">
            Book a service <ArrowUpRight size={16} />
          </button>
          <button onClick={() => setMobileNav(v => !v)} className="rounded-xl border border-forest/15 p-2 md:hidden" aria-label="Toggle menu">
            {mobileNav ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNav && <motion.nav initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t border-forest/10 md:hidden">
            <div className="container-wide flex flex-col gap-4 py-5">
              {["Services", "How it works", "About", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setMobileNav(false)}>{item}</a>)}
              <button onClick={() => { setMobileNav(false); openBooking(); }} className="rounded-full bg-forest px-5 py-3 text-white">Book a service</button>
            </div>
          </motion.nav>}
        </AnimatePresence>
      </header>

      <section className="relative bg-forest text-white">
        <div className="absolute inset-0 grid-dots opacity-70" />
        <div className="absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-teal/70 blur-3xl" />
        <div className="container-wide relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.65,ease:"easeOut"}}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-lime">
              <span className="h-2 w-2 rounded-full bg-lime" /> YOUR TRUSTED SERVICE PARTNER
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.3rem]">
              Your school errands, <span className="text-lime">handled.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              Spend less time navigating paperwork. Get reliable assistance with university registration, transcripts, document certification and more.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => openBooking()} className="group inline-flex items-center justify-center gap-3 rounded-full bg-lime px-7 py-4 font-bold text-forest transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(201,243,106,.18)]">
                Book a service <ArrowUpRight size={18} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <a href="#services" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
                Explore services <ArrowDownRight size={18} />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              {["Personal assistance", "Clear communication", "Convenient booking"].map(x => <span key={x} className="flex items-center gap-2"><Check size={16} className="text-lime" />{x}</span>)}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,scale:.96,y:16}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.7,delay:.15}} className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-[#0C514C] p-5 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-sm text-white/60">A smoother way to get things done</p><h2 className="mt-1 text-2xl font-semibold">What can we help with?</h2></div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime text-forest"><Sparkles size={24}/></span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  {icon: GraduationCap,title:"University",sub:"Registration & transcripts"},
                  {icon: FileCheck2,title:"Documents",sub:"Attestation & verification"},
                  {icon: Globe2,title:"International",sub:"WES & document mailing"},
                  {icon: PackageCheck,title:"Errands",sub:"Collection & certification"}
                ].map((item,i) => <button onClick={() => { setFilter(item.title === "International" ? "Documents" : item.title === "Errands" ? "Other" : item.title); document.getElementById("services")?.scrollIntoView({behavior:"smooth"}); }} key={item.title} className="group min-h-36 rounded-2xl border border-white/10 bg-white/[.045] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-lime/60 hover:bg-white/[.08]">
                  <item.icon size={23} className="text-lime transition group-hover:scale-110"/>
                  <p className="mt-4 font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-white/55">{item.sub}</p>
                </button>)}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-forest/70 p-4">
                <div><p className="text-sm font-semibold">Need something specific?</p><p className="mt-1 text-xs text-white/55">Tell us what you need.</p></div>
                <button onClick={() => openBooking()} className="grid h-10 w-10 place-items-center rounded-full bg-lime text-forest transition hover:rotate-45"><ArrowUpRight size={20}/></button>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl bg-white p-4 text-forest shadow-soft sm:flex">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime"><ShieldCheck size={22}/></span>
              <span><strong className="block text-sm">Service with care</strong><span className="text-xs text-ink/60">Support from start to finish</span></span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-forest/10 bg-white">
        <div className="container-wide grid gap-6 py-7 sm:grid-cols-3 sm:gap-10">
          {[
            {icon:ShieldCheck,title:"Clear process",desc:"Know what happens at every step."},
            {icon:Clock3,title:"Convenient requests",desc:"Send your request online any time."},
            {icon:MessageCircle,title:"Direct communication",desc:"Get in touch when you need help."}
          ].map((x,i)=><motion.div key={x.title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-teal"><x.icon size={22}/></span>
            <span><strong className="block text-sm">{x.title}</strong><span className="mt-1 block text-sm text-ink/60">{x.desc}</span></span>
          </motion.div>)}
        </div>
      </section>

      <section id="services" className="container-wide scroll-mt-24 py-20 sm:py-28">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-teal">OUR SERVICES</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-forest sm:text-5xl">The support you need.<br className="hidden sm:block"/> All in one place.</h2>
          <p className="mt-5 leading-7 text-ink/65">Choose a service to start your request. If you don't see exactly what you need, send us a custom enquiry.</p>
        </motion.div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map(c=><button key={c} onClick={()=>setFilter(c)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ${filter===c?"bg-forest text-white shadow-soft":"border border-forest/10 bg-white text-ink/65 hover:border-teal/40 hover:text-teal"}`}>{c}</button>)}
        </div>
        <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service,i)=><motion.article layout key={service.title} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.97}} transition={{duration:.25,delay:i*.025}} className="group flex min-h-[265px] flex-col rounded-3xl border border-forest/10 bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-teal/25 hover:shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-teal transition duration-300 group-hover:bg-lime group-hover:text-forest"><service.icon size={23}/></span>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[.17em] text-teal/75">{service.category}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug text-forest">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink/60">{service.desc}</p>
              <button onClick={()=>openBooking(service.title)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal transition group-hover:gap-3">Request service <ArrowRight size={15}/></button>
            </motion.article>)}
          </AnimatePresence>
        </motion.div>
        <p className="mt-6 text-center text-xs leading-5 text-ink/50">Some services depend on the relevant institution or authority. Motika provides assistance and follow-up; official decisions remain with the issuing institution.</p>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-[#EAEDE4] py-20 sm:py-24">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-teal">HOW IT WORKS</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-forest sm:text-5xl">Simple from start to finish.</h2><p className="mt-5 max-w-md leading-7 text-ink/65">A straightforward process that keeps your request clear and organised.</p><button onClick={()=>openBooking()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal">Start a booking <ArrowUpRight size={16}/></button></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {n:"01",title:"Choose",desc:"Select the service and explain what you need."},
                {n:"02",title:"Confirm",desc:"We review the details and confirm the cost and timing."},
                {n:"03",title:"Complete",desc:"Follow your request and payment status through the agreed process."}
              ].map((s,i)=><motion.div key={s.n} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className="rounded-3xl bg-white p-6 sm:p-7"><span className="text-sm font-bold text-teal">{s.n}</span><h3 className="mt-7 text-xl font-semibold text-forest">{s.title}</h3><p className="mt-3 text-sm leading-6 text-ink/60">{s.desc}</p></motion.div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container-wide scroll-mt-24 py-20 sm:py-24">
        <div className="grid gap-10 rounded-[2rem] bg-forest p-7 text-white sm:p-12 lg:grid-cols-2 lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-lime">WHY MOTIKA</p><h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Less paperwork stress.<br/>More peace of mind.</h2><p className="mt-5 max-w-lg leading-7 text-white/65">Get a clear point of contact for your school errands and document-related requests. We help you understand the process and keep your request moving.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{["Personalised assistance","Clear service requests","Updates on your request","Convenient contact options"].map(t=><div key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime text-forest"><Check size={17}/></span><span className="text-sm font-medium">{t}</span></div>)}</div>
        </div>
      </section>

      <section id="contact" className="container-wide scroll-mt-24 pb-20">
        <div className="grid gap-8 rounded-[2rem] border border-forest/10 bg-white p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal">CONTACT US</p>
            <h2 className="mt-3 text-3xl font-semibold text-forest sm:text-4xl">Have a question? Send us an email.</h2>
            <p className="mt-3 max-w-xl leading-7 text-ink/60">You can contact us directly without booking a service. We’ll get back to you as soon as possible.</p>
            <a href="mailto:crithltd@gmail.com" className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-teal hover:text-forest">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream"><Mail size={20}/></span>
              crithltd@gmail.com
            </a>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://wa.me/237675390251" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/15 px-6 py-3.5 font-semibold text-forest transition hover:bg-cream"><MessageCircle size={18}/> WhatsApp us</a>
              <button onClick={()=>openBooking()} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-bold text-forest transition hover:brightness-95">Book a service <ArrowUpRight size={18}/></button>
            </div>
          </div>
          <form className="space-y-4 rounded-3xl bg-cream p-5 sm:p-7" onSubmit={sendContactMessage}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="contact-name">Your name</label><input id="contact-name" name="contact-name" required minLength={2} maxLength={120} autoComplete="name" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
              <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="contact-email">Your email</label><input id="contact-email" name="contact-email" type="email" required maxLength={254} autoComplete="email" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
            </div>
            <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="contact-subject">Subject</label><input id="contact-subject" name="contact-subject" required minLength={3} maxLength={150} className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
            <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="contact-message">Message</label><textarea id="contact-message" name="contact-message" required minLength={10} maxLength={5000} rows={5} className="w-full resize-y rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/></div>
            {contactSent && <p role="status" className="rounded-xl bg-white p-3 text-sm text-teal">Your message has been sent. Thank you for contacting Motika.</p>}
            {contactError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{contactError}</p>}
            <button type="submit" disabled={contactSending} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60">{contactSending ? "Sending..." : "Send message"} <ArrowUpRight size={17}/></button>
          </form>
        </div>
      </section>

      <footer className="bg-[#052F2D] py-9 text-white">
        <div className="container-wide flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-forest"><GraduationCap size={22}/></span><span><strong className="block">MOTIKA</strong><span className="text-[10px] tracking-[.16em] text-white/55">SERVICES ULTRA FAST</span></span></div>
          <p className="text-sm text-white/50">© {new Date().getFullYear()} Motika Services. All rights reserved.</p>
          <a href="tel:+237675390251" className="text-sm text-lime transition hover:text-white">+237 675 390 251</a>
        </div>
      </footer>

      <AnimatePresence>
        {bookingOpen && <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-[#041F1E]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(e)=>{if(e.target===e.currentTarget)setBookingOpen(false);}}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="booking-title" initial={{opacity:0,y:30,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.98}} transition={{duration:.22}} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-cream p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal">SERVICE REQUEST</p><h2 id="booking-title" className="mt-2 text-2xl font-semibold text-forest">Book with Motika</h2><p className="mt-2 text-sm leading-6 text-ink/60">Share your details. We'll confirm the service fee and timeline before payment.</p></div><button onClick={()=>setBookingOpen(false)} className="rounded-full border border-forest/10 bg-white p-2" aria-label="Close booking form"><X size={20}/></button></div>
            {submitted ? <div className="mt-7 rounded-2xl border border-teal/15 bg-white p-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-forest"><Check size={24}/></span><h3 className="mt-4 text-xl font-semibold text-forest">Request prepared</h3><p className="mt-2 text-sm leading-6 text-ink/65">This starter currently demonstrates the booking interface. Connect the booking API, database and payment provider before accepting real customer requests.</p><a className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white" href="https://wa.me/237675390251" target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowUpRight size={16}/></a></div> :
            <form className="mt-7 space-y-4" onSubmit={(e)=>{e.preventDefault();setSubmitted(true);}}>
              <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="service">Service required</label><div className="relative"><select id="service" required value={selectedService} onChange={e=>setSelectedService(e.target.value)} className="w-full appearance-none rounded-xl border border-forest/15 bg-white px-4 py-3.5 pr-10 text-sm text-ink"><option value="">Choose a service</option>{services.map(s=><option key={s.title} value={s.title}>{s.title}</option>)}<option value="Other / custom request">Other / custom request</option></select><ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50"/></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="name">Full name</label><input id="name" required minLength={2} placeholder="Your full name" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div><div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="phone">Phone / WhatsApp</label><input id="phone" required type="tel" placeholder="+237 ..." className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div></div>
              <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="email">Email address</label><input id="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
              <div><label className="mb-2 block text-sm font-semibold text-forest" htmlFor="details">Request details</label><textarea id="details" required minLength={8} rows={3} placeholder="Tell us about your request, deadline, and any important details..." className="w-full resize-y rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm"/></div>
              <p className="text-xs leading-5 text-ink/50">No payment is taken in this demo. The service fee and payment instructions should be confirmed before checkout.</p>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-bold text-white transition hover:bg-teal">Continue request <ArrowUpRight size={17}/></button>
            </form>}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}
