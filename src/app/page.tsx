"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, CheckCircle2, Clock, Target, ChartBar,
  BookOpen, Star, Package, Zap, ShoppingCart, Phone, MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────── WELCOME POPUP ─────────────────── */
function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popup_seen");
    if (alreadySeen) return;
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem("popup_seen", "1");
    // entrance animation
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.88, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }
    );
  }, [visible]);

  const close = () => {
    gsap.to(cardRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.25 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => setVisible(false) });
  };

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div ref={cardRef} className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top colour bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* Close button */}
        <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10">
          ✕
        </button>

        {/* Image banner */}
        <div className="relative w-full h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/middle_section.png" alt="Magic Daily Planner" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/40 to-zinc-900" />
          {/* Offer badge */}
          <div className="absolute top-3 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            🔥 সীমিত সময়ের অফার!
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-2xl font-black text-white drop-shadow">Magic Daily Planner</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 pt-4">
          {/* Price */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-1">অফার মূল্য</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">৩৯০</span>
                <div>
                  <span className="text-xl font-medium text-zinc-300">টাকা</span>
                  <div className="text-zinc-500 line-through text-sm">৫২০ টাকা</div>
                </div>
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2 py-1 rounded-full self-start mt-1">২৫% ছাড়</span>
              </div>
            </div>
          </div>

          {/* Quick features */}
          <ul className="space-y-2 mb-6 text-sm">
            {[
              "✅ ৬ মাসের পরিকল্পনার জন্য সম্পূর্ণ প্ল্যানার",
              "✅ ডেইলি, উইকলি, মান্থলি ও ইয়ারলি সেকশন",
              "✅ বাজেট ট্র্যাকার + গ্রোথ ট্র্যাকার সহ",
              "✅ ক্যাশ অন ডেলিভারি — সারা বাংলাদেশে",
            ].map((f, i) => (
              <li key={i} className="text-zinc-300">{f}</li>
            ))}
          </ul>

          {/* Delivery note */}
          <p className="text-center text-xs text-zinc-500 mb-4">+ ডেলিভারি চার্জ মাত্র ৬০–১০০ টাকা</p>

          {/* CTA */}
          <a
            href="#checkout"
            onClick={close}
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)] hover:scale-[1.02]"
          >
            🛒 এখনই অর্ডার করুন — ৩৯০ টাকা
          </a>

          <button onClick={close} className="w-full mt-3 text-zinc-500 hover:text-zinc-300 text-sm py-2 transition-colors">
            না, আপাতত দেখতে থাকি →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── CHECKOUT FORM ─────────────────── */
function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "অর্ডার সম্পন্ন করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
          <CheckCircle2 className="text-green-400" size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">ধন্যবাদ! 🎉</h3>
        <p className="text-zinc-300">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        <button onClick={() => setSuccess(false)} className="mt-6 text-blue-400 hover:text-blue-300 font-medium px-6 py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/10 transition-colors">
          নতুন অর্ডার করুন
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">আপনার নাম *</label>
          <input type="text" name="name" className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white placeholder:text-zinc-600" placeholder="পূর্ণ নাম লিখুন" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300 ml-1">মোবাইল নাম্বার *</label>
          <input type="tel" name="phone" className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white placeholder:text-zinc-600" placeholder="০১৭xxxxxxxx" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300 ml-1">পূর্ণাঙ্গ ঠিকানা *</label>
        <textarea name="address" rows={3} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white resize-none placeholder:text-zinc-600" placeholder="জেলা, উপজেলা, গ্রাম/বাড়ি নম্বর সহ সম্পূর্ণ ঠিকানা" required />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] disabled:opacity-60 flex items-center justify-center gap-3">
        {loading ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />প্রসেসিং...</>
        ) : (
          <><ShoppingCart size={20} />এখনই অর্ডার করুন — ৩৯০ টাকা</>
        )}
      </button>
      <p className="text-center text-xs text-zinc-500">ক্যাশ অন ডেলিভারি • ডেলিভারি চার্জ ৬০–১০০ টাকা</p>
    </form>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.1 });
      gsap.from(".hero-title", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.55 });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.75 });
      gsap.from(".hero-img", { scale: 0.9, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });

      // Book spin/float
      gsap.to(".book-float", { y: -20, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // Scroll sections
      gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          { scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
        );
      });

      // Stats counter
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        const end = parseInt(el.dataset.target || "0");
        gsap.fromTo({ val: 0 }, { val: 0 }, {
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
          val: end, duration: 1.5, ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].val).toString(); }
        });
      });

      // Feature cards stagger
      gsap.fromTo(".feat-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".feat-grid", start: "top 95%", toggleActions: "play none none none" }, y: 0, opacity: 1, duration: 0.5, stagger: 0.08, clearProps: "all" }
      );

      // Poster cards
      gsap.fromTo(".poster-card",
        { scale: 0.92, opacity: 0 },
        { scrollTrigger: { trigger: ".poster-grid", start: "top 95%", toggleActions: "play none none none" }, scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)", clearProps: "all" }
      );

      // Refresh after setup so triggers calculate correctly
      ScrollTrigger.refresh();
    }, containerRef);

    // Extra delayed refresh to handle Next.js hydration timing
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => { ctx.revert(); clearTimeout(timer); };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <WelcomePopup />

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide">
        🎉 সীমিত সময়ের অফার! মূল্য <span className="line-through opacity-70">৫২০ টাকা</span> → <span className="font-bold text-yellow-300 text-base">৩৯০ টাকা</span> — আজই অর্ডার করুন!
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-zinc-950/80 to-zinc-950 z-10" />
          <Image src="/hero_banner.png" alt="Hero" fill className="object-cover opacity-40" unoptimized />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass text-sm font-medium mb-6 text-blue-300 border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Magic Publication BD — অফিসিয়াল স্টোর
            </div>
            <h1 className="hero-title text-5xl md:text-6xl xl:text-7xl font-black mb-6 leading-[1.08]">
              সময়কে নিয়ন্ত্রণ করুন,{" "}
              <span className="text-gradient">সফলতাকে নিজের করুন।</span>
            </h1>
            <p className="hero-sub text-xl text-zinc-300 mb-10 leading-relaxed max-w-lg">
              Magic Daily Planner আপনাকে প্রতিদিন ফোকাসড, সংগঠিত ও প্রোডাক্টিভ থাকতে সাহায্য করবে। ৬ মাসের জন্য একটি পারফেক্ট প্ল্যানিং জার্নি।
            </p>
            <div className="hero-cta flex flex-wrap gap-4 items-center">
              <Link href="#checkout" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]">
                <ShoppingCart size={20} /> এখনই অর্ডার করুন <ArrowRight size={18} />
              </Link>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">৩৯০ <span className="text-lg font-medium">টাকা</span></span>
                <span className="text-sm text-zinc-500 line-through">৫২০ টাকা</span>
              </div>
            </div>
          </div>
          {/* Book Image */}
          <div className="book-float hidden lg:flex justify-center">
            <div className="relative w-[380px] h-[480px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl scale-90" />
              <Image src="/middle_section.png" alt="Magic Daily Planner Book" fill className="object-contain drop-shadow-2xl" unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14 px-6 bg-zinc-900/60 border-y border-zinc-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center fade-up">
          {[
            { target: 200, suffix: "+", label: "ডেইলি পেজ" },
            { target: 6, suffix: " মাস", label: "পরিকল্পনার সময়কাল" },
            { target: 8, suffix: "টি", label: "ফিচার বিভাগ" },
            { target: 500, suffix: "+", label: "খুশি কাস্টমার" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-gradient mb-1">
                <span className="stat-number" data-target={s.target}>0</span>{s.suffix}
              </div>
              <p className="text-zinc-400 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="py-20 px-6 fade-up">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-4 md:p-6 border-white/10 shadow-2xl overflow-hidden">
          <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl" />
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform z-10">
              <svg className="w-9 h-9 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <p className="mt-5 text-zinc-400 font-medium z-10">ভিডিওটি দেখুন — Magic Daily Planner সম্পর্কে জানুন</p>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-6 fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 border-red-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-500/8 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">আপনি কি এই সমস্যাগুলোর মধ্যে আছেন?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "কাজ শুরু করেন, কিন্তু শেষ করতে পারেন না",
                "সময় নষ্ট হয়ে যায়, বুঝতেই পারেন না",
                "অনেক লক্ষ্য আছে, কিন্তু পরিষ্কার পরিকল্পনা নেই",
                "দিন শেষে মনে হয় কিছুই অর্জন হয়নি",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl">
                  <span className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400 font-bold text-sm mt-0.5">✕</span>
                  <span className="text-zinc-300">{p}</span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-2xl p-6 text-center text-lg font-medium">
              <p className="text-blue-300 mb-1">👉 সমস্যা আপনার ইচ্ছাশক্তিতে না…</p>
              <p className="text-purple-300">👉 সমস্যা হলো সঠিক প্ল্যানিং সিস্টেম নেই।</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO + PHOTO ── */}
      <section className="py-24 px-6 relative overflow-hidden fade-up">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden glass border-white/10 group" style={{ aspectRatio: "4/5" }}>
            <Image src="/book_showcase.png" alt="Magic Planner View" fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="glass px-4 py-2 rounded-full text-sm font-medium border-white/10 text-blue-300">✨ প্রিমিয়াম কোয়ালিটি</div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Daily Planner</span><br />কেন ব্যবহার করবেন?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
              এটি একটি সহজ কিন্তু শক্তিশালী প্ল্যানার — যা আপনার প্রতিটি দিনকে ফলপ্রসূ করে তুলবে।
            </p>
            <div className="space-y-4">
              {[
                { text: "প্রতিদিনের কাজ গুছিয়ে নিতে পারবেন", icon: <CheckCircle2 className="text-blue-400" size={22} /> },
                { text: "লক্ষ্য নির্ধারণ ও ট্র্যাক করতে পারবেন", icon: <Target className="text-purple-400" size={22} /> },
                { text: "সময় সঠিকভাবে ব্যবহার করতে পারবেন", icon: <Clock className="text-blue-400" size={22} /> },
                { text: "বাজেট ও খরচের হিসাব রাখতে পারবেন", icon: <ChartBar className="text-purple-400" size={22} /> },
                { text: "শৃঙ্খলাপূর্ণ ও সফল জীবন গড়তে পারবেন", icon: <Zap className="text-yellow-400" size={22} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 glass p-4 rounded-2xl border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 flex-shrink-0">{item.icon}</div>
                  <span className="text-zinc-200 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT POSTER SHOWCASE ── */}
      <section className="py-24 px-6 bg-zinc-900/40 border-y border-zinc-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">প্ল্যানারটি দেখুন</h2>
            <p className="text-xl text-zinc-400">আসল প্রোডাক্টের ছবি — ঠিক যেমনটা পাবেন</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { src: "/hero_banner.png", label: "কভার ডিজাইন" },
              { src: "/middle_section.png", label: "ইনসাইড ভিউ" },
              { src: "/sample_page_1.png", label: "বাজেট ট্র্যাকার" },
              { src: "/sample_page_2.png", label: "উইকলি পেজ" },
              { src: "/sample_page_3.png", label: "গ্রোথ ট্র্যাকার" },
            ].map((p, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden glass border border-white/10 hover:border-blue-500/40 transition-all hover:scale-105 cursor-pointer">
                <div className="relative h-64 md:h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.label} className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <span className="text-xs font-medium text-zinc-300 bg-zinc-900/70 px-2 py-1 rounded-full">{p.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">ভিতরে কী কী আছে?</h2>
            <p className="text-xl text-zinc-400">একটি প্ল্যানারে ৮টি শক্তিশালী বিভাগ</p>
          </div>
          <div className="feat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "ইয়ারলি প্ল্যানার", desc: "১ পৃষ্ঠা", icon: "📅", color: "from-blue-500/20 to-blue-600/5" },
              { title: "মান্থলি প্ল্যানার", desc: "৬ মাসের ৬ পৃষ্ঠা", icon: "🗓️", color: "from-purple-500/20 to-purple-600/5" },
              { title: "বাজেট প্ল্যানার", desc: "মাসিক + দৈনিক বাজেট", icon: "💰", color: "from-green-500/20 to-green-600/5" },
              { title: "উইকলি প্ল্যানার", desc: "২৫ সপ্তাহের ২৫ পৃষ্ঠা", icon: "📋", color: "from-yellow-500/20 to-yellow-600/5" },
              { title: "গ্রোথ ট্র্যাকার", desc: "দৈনিক পারফরম্যান্স", icon: "📈", color: "from-orange-500/20 to-orange-600/5" },
              { title: "ডেইলি প্ল্যানার", desc: "২০০ পৃষ্ঠা, ২৫ সপ্তাহ", icon: "✏️", color: "from-pink-500/20 to-pink-600/5" },
              { title: "নোটবুক", desc: "১২ পৃষ্ঠা", icon: "📓", color: "from-cyan-500/20 to-cyan-600/5" },
              { title: "ক্যালেন্ডার", desc: "ছয় মাসের জার্নি", icon: "🌟", color: "from-violet-500/20 to-violet-600/5" },
            ].map((f, i) => (
              <div key={i} className={`feat-card glass p-6 rounded-2xl border-white/5 hover:border-white/15 bg-gradient-to-br ${f.color} transition-all hover:scale-[1.02] cursor-default`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-1.5 text-white">{f.title}</h3>
                <p className="text-zinc-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Who is it for */}
          <div className="mt-16 glass rounded-3xl p-8 md:p-10 border-white/5 bg-gradient-to-br from-blue-900/10 to-purple-900/10 fade-up text-center">
            <h3 className="text-2xl font-bold mb-6">কার জন্য উপযুক্ত?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["👩‍🎓 ছাত্রছাত্রী", "🚀 উদ্যোক্তা", "💼 চাকরিজীবী", "🏪 ব্যবসায়ী", "🌱 যারা নিজেকে গুছিয়ে নিতে চান"].map((tag, i) => (
                <span key={i} className="px-5 py-2.5 rounded-full border border-white/10 bg-zinc-800/50 text-sm font-medium hover:border-blue-500/40 transition-colors">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CTA ── */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 border-y border-blue-500/20 fade-up">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block text-4xl mb-4">🎯</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">আজই শুরু করুন আপনার প্রডাক্টিভ জার্নি!</h2>
          <p className="text-zinc-300 text-lg mb-8">মাত্র <span className="text-yellow-300 font-bold">৩৯০ টাকায়</span> পান ৬ মাসের জন্য একটি সম্পূর্ণ প্ল্যানিং সিস্টেম।</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-black text-white">৩৯০<span className="text-2xl font-medium text-zinc-300"> টাকা</span></div>
              <div className="text-zinc-500 line-through text-lg">৫২০ টাকা</div>
              <div className="text-green-400 text-sm font-medium mt-1">২৫% ছাড়!</div>
            </div>
            <div className="w-px h-16 bg-zinc-700 hidden md:block" />
            <div className="text-left space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> ক্যাশ অন ডেলিভারি</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> সারা বাংলাদেশে ডেলিভারি</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> প্রিমিয়াম প্রিন্ট কোয়ালিটি</div>
            </div>
            <Link href="#checkout" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)]">
              অর্ডার করুন <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SAMPLE PAGES ── */}
      <section className="py-24 px-6 fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">নমুনা পৃষ্ঠা</h2>
            <p className="text-xl text-zinc-400">প্ল্যানারের ভিতরের কিছু পাতার ঝলক</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { src: "/sample_page_1.png", title: "বাজেট ট্র্যাকার", desc: "মাসিক ও দৈনিক খরচের হিসাব রাখুন" },
              { src: "/sample_page_2.png", title: "উইকলি প্ল্যানার", desc: "সপ্তাহের লক্ষ্য ও কাজ পরিকল্পনা" },
              { src: "/sample_page_3.png", title: "গ্রোথ ট্র্যাকার", desc: "প্রতিদিনের অগ্রগতি ট্র্যাক করুন" },
            ].map((p, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden glass border-white/10 hover:border-blue-500/40 transition-all" style={{ aspectRatio: "3/4" }}>
                <Image src={p.src} alt={p.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-zinc-400">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-zinc-900/40 border-y border-zinc-800/60 fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">কাস্টমারদের কথা</h2>
            <p className="text-zinc-400 text-lg">যারা ইতিমধ্যে ব্যবহার শুরু করেছেন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "রাফিউল ইসলাম", role: "উদ্যোক্তা", review: "এই প্ল্যানারটি আমার ব্যবসার পরিকল্পনা করতে অনেক সাহায্য করছে। প্রতিদিনের টাস্ক লিস্ট থেকে শুরু করে মাসিক রিভিউ পর্যন্ত সব কিছু গুছানো আছে।", rating: 5 },
              { name: "সুমাইয়া আক্তার", role: "বিশ্ববিদ্যালয় ছাত্রী", review: "পড়াশোনার সময় ম্যানেজমেন্টে এটা খুবই কাজে দিচ্ছে। বাজেট ট্র্যাকার সেকশনটা বিশেষভাবে দরকারী।", rating: 5 },
              { name: "মোহাম্মদ তানভীর", role: "চাকরিজীবী", review: "অফিসের কাজ এবং ব্যক্তিগত জীবন দুটোই এখন সুসংগঠিত। প্রতিদিন মনে হচ্ছে কাজ শেষ হচ্ছে, উদ্বেগ কমেছে।", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="glass p-7 rounded-2xl border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-zinc-300 leading-relaxed mb-5">&ldquo;{t.review}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">{t.name[0]}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDER FORM ── */}
      <section id="checkout" className="py-24 px-6 fade-up relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-16 bg-gradient-to-b from-transparent to-blue-500/50" />
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-3xl overflow-hidden border-blue-500/20 shadow-[0_0_60px_-20px_rgba(99,102,241,0.4)]">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
                  <Package size={14} /> এখনই অর্ডার করুন
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">আপনার অর্ডার দিন</h2>
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <span className="text-5xl font-black text-white">৩৯০</span>
                  <div>
                    <span className="text-xl font-medium text-zinc-300">টাকা</span>
                    <div className="text-zinc-500 line-through text-sm">৫২০ টাকা</div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2 py-1 rounded-full">২৫% ছাড়</span>
                </div>
                <p className="text-zinc-500 text-sm">+ ডেলিভারি চার্জ ৬০–১০০ টাকা (ক্যাশ অন ডেলিভারি)</p>
              </div>
              <CheckoutForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-900 border-t border-zinc-800 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="text-xl font-black text-white mb-3">Magic Publication BD</div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-5">আমরা বিশ্বাস করি সঠিক পরিকল্পনাই সফলতার চাবিকাঠি। আমাদের Daily Planner আপনার প্রতিটি দিনকে অর্থবহ করে তুলবে।</p>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                অর্ডার নেওয়া হচ্ছে
              </div>
            </div>
            {/* Links */}
            <div>
              <div className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">প্রোডাক্ট</div>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li><a href="#checkout" className="hover:text-white transition-colors">Daily Planner অর্ডার করুন</a></li>
                <li><a href="#" className="hover:text-white transition-colors">নমুনা পৃষ্ঠা দেখুন</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ফিচারস সম্পর্কে জানুন</a></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <div className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">যোগাযোগ</div>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>অর্ডার ও তথ্যের জন্য কল করুন</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>সারা বাংলাদেশে হোম ডেলিভারি</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© ২০২৬ Magic Publication BD. সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="text-center">
              Magic Daily Planner —{" "}
              <span className="text-white font-semibold">৩৯০ টাকা</span>
              {" "}(অফার মূল্য) ·{" "}
              <a href="#checkout" className="text-blue-400 hover:text-blue-300 transition-colors">এখনই অর্ডার করুন →</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
