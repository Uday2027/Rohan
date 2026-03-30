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
            className="shimmer-btn block w-full text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-95"
          >
            🛒 এখনই অর্ডার করুন — ৩৯০ টাকা
          </a>

          <button onClick={close} className="w-full mt-4 text-zinc-500 hover:text-zinc-300 text-xs font-medium py-2 transition-colors">
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
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [division, setDivision] = useState("");
  const [zilla, setZilla] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // Full Bangladesh divisions and zillas
  const divisions = [
    {
      name: "Dhaka", zillas: [
        "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"
      ]
    },
    {
      name: "Chattogram", zillas: [
        "Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati"
      ]
    },
    {
      name: "Rajshahi", zillas: [
        "Bogura", "Joypurhat", "Naogaon", "Natore", "Chapai Nawabganj", "Pabna", "Rajshahi", "Sirajganj"
      ]
    },
    {
      name: "Khulna", zillas: [
        "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"
      ]
    },
    {
      name: "Barishal", zillas: [
        "Barguna", "Barishal", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur"
      ]
    },
    {
      name: "Sylhet", zillas: [
        "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"
      ]
    },
    {
      name: "Rangpur", zillas: [
        "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"
      ]
    },
    {
      name: "Mymensingh", zillas: [
        "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
      ]
    },
  ];
  const selectedDivision = divisions.find(d => d.name === division);
  const zillaOptions = selectedDivision ? selectedDivision.zillas : [];
  const [qtyBlack, setQtyBlack] = useState("");
  const [qtyWhite, setQtyWhite] = useState("");
  const unitPrice = 390;
  const totalQty = (parseInt(qtyBlack) || 0) + (parseInt(qtyWhite) || 0);
  const productTotal = totalQty * unitPrice;
  const totalPrice = productTotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const address = `${formData.get("division")}, ${formData.get("zilla")}, ${formData.get("detail_address")}`;
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address,
      qty_black: Number(formData.get("qty_black")),
      qty_white: Number(formData.get("qty_white")),
      delivery_area: formData.get("zilla") === "Dhaka" ? "inside" : "outside",
      delivery_charge: formData.get("zilla") === "Dhaka" ? 60 : 100,
      total_price: ((parseInt(formData.get("qty_black") as string) || 0) + (parseInt(formData.get("qty_white") as string) || 0)) * unitPrice + (formData.get("zilla") === "Dhaka" ? 60 : 100),
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
        <p className="text-zinc-300 mb-2">আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        <p className="text-zinc-500 text-xs font-medium">জরুরি প্রয়োজনে আমাদের ফোন করতে পারেন: <a href="tel:+8801972653480" className="text-blue-400 hover:underline">+880 1972-653480</a></p>
        <button onClick={() => setSuccess(false)} className="mt-6 text-blue-400 hover:text-blue-300 font-medium px-6 py-2 rounded-full border border-blue-500/30 hover:bg-blue-500/10 transition-colors">
          নতুন অর্ডার করুন
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm text-center animate-shake">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">আপনার নাম *</label>
          <input type="text" name="name" className="w-full bg-zinc-950/50 border border-white/5 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-5 md:py-4 focus:outline-none focus:border-blue-500 transition-all text-white text-sm md:text-base placeholder:text-zinc-700 focus:bg-zinc-900/80 focus:ring-4 focus:ring-blue-500/10" placeholder="পূর্ণ নাম লিখুন" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">মোবাইল নাম্বার *</label>
          <input type="tel" name="phone" className="w-full bg-zinc-950/50 border border-white/5 rounded-xl md:rounded-2xl px-4 py-3.5 md:px-5 md:py-4 focus:outline-none focus:border-blue-500 transition-all text-white text-sm md:text-base placeholder:text-zinc-700 focus:bg-zinc-900/80 focus:ring-4 focus:ring-blue-500/10" placeholder="০১৭xxxxxxxx" required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">বিভাগ *</label>
        <select
          name="division"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-all text-white text-sm appearance-none shadow-sm focus:bg-zinc-900/80"
          required
          value={division}
          onChange={e => {
            setDivision(e.target.value);
            setZilla("");
          }}
          style={{ backgroundImage: 'linear-gradient(45deg, #6366f1 0%, #a21caf 100%)', backgroundBlendMode: 'multiply' }}
        >
          <option value="">বিভাগ নির্বাচন করুন</option>
          {divisions.map(d => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">জেলা *</label>
        <select
          name="zilla"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-all text-white text-sm appearance-none shadow-sm focus:bg-zinc-900/80"
          required
          value={zilla}
          onChange={e => {
            setZilla(e.target.value);
            setDeliveryCharge(e.target.value === "Dhaka" ? 60 : 100);
          }}
          disabled={!division}
          style={{ backgroundImage: 'linear-gradient(45deg, #6366f1 0%, #a21caf 100%)', backgroundBlendMode: 'multiply' }}
        >
          <option value="">জেলা নির্বাচন করুন</option>
          {zillaOptions.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">বিস্তারিত ঠিকানা *</label>
        <input
          type="text"
          name="detail_address"
          className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-all text-white text-sm"
          placeholder="গ্রাম/বাড়ি নম্বর, উপজেলা, ইত্যাদি"
          required
          value={detailAddress}
          onChange={e => setDetailAddress(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Black Planner Variant */}
        <div className={`flex bg-zinc-950/50 border rounded-2xl p-4 items-center gap-4 transition-all duration-300 ${parseInt(qtyBlack) > 0 ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-blue-500/5" : "border-white/5 hover:border-white/20"}`}>
          <div className="relative w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 shadow-inner group">
            <Image src="/ProductImgae1.jpeg" alt="Black Planner" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-white leading-tight">প্ল্যানার</h4>
                {parseInt(qtyBlack) > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              </div>
              <div className="text-xs text-zinc-400 mb-3">Black Edition</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQtyBlack(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString())}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!qtyBlack || parseInt(qtyBlack) === 0 ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed" : "bg-zinc-800 text-white hover:bg-zinc-700 hover:text-blue-400 active:scale-90"}`}
                disabled={!qtyBlack || parseInt(qtyBlack) === 0}
              >
                <div className="w-3.5 h-[2px] bg-current rounded-full" />
              </button>
              <div className="w-8 font-black text-white text-center text-lg">{parseInt(qtyBlack) || 0}</div>
              <button
                type="button"
                onClick={() => setQtyBlack(prev => ((parseInt(prev) || 0) + 1).toString())}
                className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 hover:text-blue-400 active:scale-90 transition-all shadow-md"
              >
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  <div className="absolute w-full h-[2px] bg-current rounded-full" />
                  <div className="absolute h-full w-[2px] bg-current rounded-full" />
                </div>
              </button>
            </div>
            <input type="hidden" name="qty_black" value={parseInt(qtyBlack) || 0} />
          </div>
        </div>

        {/* White Planner Variant */}
        <div className={`flex bg-zinc-950/50 border rounded-2xl p-4 items-center gap-4 transition-all duration-300 ${parseInt(qtyWhite) > 0 ? "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-purple-500/5" : "border-white/5 hover:border-white/20"}`}>
          <div className="relative w-24 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 shadow-inner group">
            <Image src="/ProductImgae2.jpeg" alt="White Planner" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-white leading-tight">প্ল্যানার</h4>
                {parseInt(qtyWhite) > 0 && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
              </div>
              <div className="text-xs text-zinc-400 mb-3">White Edition</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQtyWhite(prev => Math.max(0, (parseInt(prev) || 0) - 1).toString())}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!qtyWhite || parseInt(qtyWhite) === 0 ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed" : "bg-zinc-800 text-white hover:bg-zinc-700 hover:text-purple-400 active:scale-90"}`}
                disabled={!qtyWhite || parseInt(qtyWhite) === 0}
              >
                <div className="w-3.5 h-[2px] bg-current rounded-full" />
              </button>
              <div className="w-8 font-black text-white text-center text-lg">{parseInt(qtyWhite) || 0}</div>
              <button
                type="button"
                onClick={() => setQtyWhite(prev => ((parseInt(prev) || 0) + 1).toString())}
                className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 hover:text-purple-400 active:scale-90 transition-all shadow-md"
              >
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  <div className="absolute w-full h-[2px] bg-current rounded-full" />
                  <div className="absolute h-full w-[2px] bg-current rounded-full" />
                </div>
              </button>
            </div>
            <input type="hidden" name="qty_white" value={parseInt(qtyWhite) || 0} />
          </div>
        </div>
      </div>
      {/* Delivery area selection removed, now auto-calculated from zilla */}
      <div className="text-center text-sm text-zinc-400">মোট পণ্য: <span className="font-bold text-white">{totalQty}</span> × ৩৯০ = <span className="font-bold text-white">{productTotal} টাকা</span></div>
      <div className="text-center text-sm text-zinc-400">ডেলিভারি চার্জ: <span className="font-bold text-white">{deliveryCharge} টাকা</span></div>
      <div className="text-center text-lg font-bold text-white bg-blue-500/10 border border-blue-500/20 rounded-xl py-3">মোট মূল্য: {totalPrice} টাকা</div>
      <button type="submit" disabled={loading || totalQty === 0} className="cursor-pointer shimmer-btn w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base md:text-xl py-4 md:py-5 rounded-xl md:rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] disabled:opacity-60 flex items-center justify-center gap-2 md:gap-3 active:scale-95">
        {loading ? (
          <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />প্রসেসিং...</>
        ) : (
          <><ShoppingCart size={24} className="drop-shadow" />এখনই অর্ডার করুন</>
        )}
      </button>
      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <CheckCircle2 size={14} className="text-green-500" /> ক্যাশ অন ডেলিভারি
        </div>
        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <CheckCircle2 size={14} className="text-green-500" /> সারা বাংলাদেশ
        </div>
      </div>
    </form>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let carouselTicker: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // Hero
      gsap.from(".hero-badge", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.1 });
      gsap.from(".hero-title", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.55 });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.75 });
      gsap.from(".hero-img", { scale: 0.9, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });

      // Book float + rotate
      gsap.to(".book-float", {
        y: -15,
        rotateZ: 2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

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

      // 3D Carousel for sample pages
      const track = carouselTrackRef.current;
      if (track) {
        const cards = track.querySelectorAll<HTMLElement>(".carousel-card");
        const isMobile = window.innerWidth < 768;
        const cardW = isMobile ? 160 : 260;
        const gap = isMobile ? 16 : 24;
        const halfLen = cards.length / 2;
        const singleWidth = halfLen * (cardW + gap);

        cards.forEach((card, i) => {
          gsap.set(card, { x: i * (cardW + gap) });
        });

        // Extend wrap range so cards travel well past the viewport edges before recycling
        const wrap = gsap.utils.wrap(-cardW * 2, singleWidth);
        const speed = isMobile ? 0.8 : 0.5;

        // Gentler 3D on mobile — less perspective depth, smaller rotation angle
        const perspectiveVal = isMobile ? 800 : 1200;
        const maxRotateY = isMobile ? 20 : 45;
        const maxZ = isMobile ? 30 : 80;

        gsap.set(track.parentElement!, { perspective: perspectiveVal });

        const proxy = { x: 0 };
        carouselTicker = () => {
          proxy.x -= speed;
          const containerW = track.parentElement!.offsetWidth;
          const center = containerW / 2 - cardW / 2;
          // Use a wider range than viewport so edge cards fully fade before wrapping
          const fadeRange = containerW / 2 + cardW;

          cards.forEach((card, i) => {
            const rawX = wrap(i * (cardW + gap) + proxy.x);
            const distFromCenter = rawX - center;
            // Allow normalizedDist to exceed 1 — cards far off-edge will be fully invisible
            const normalizedDist = distFromCenter / fadeRange;
            const absDist = Math.min(Math.abs(normalizedDist), 1.5);

            const rotateY = Math.max(-1, Math.min(1, normalizedDist)) * -maxRotateY;
            const z = (1 - Math.min(absDist, 1)) * maxZ - maxZ / 2;
            // Smooth fade: fully visible at center, invisible at edges
            const opacity = gsap.utils.clamp(0, 1, 1 - absDist * 0.85);
            const scale = gsap.utils.clamp(0.7, 1, 1 - absDist * 0.2);

            gsap.set(card, {
              x: rawX,
              rotateY,
              z,
              opacity,
              scale,
              zIndex: Math.round((1 - Math.min(absDist, 1)) * 100),
            });
          });
        };
        gsap.ticker.add(carouselTicker);
      }

      // Refresh after setup so triggers calculate correctly
      ScrollTrigger.refresh();
    }, containerRef);

    // Extra delayed refresh to handle Next.js hydration timing
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      if (carouselTicker) gsap.ticker.remove(carouselTicker);
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <WelcomePopup />

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white text-center py-2 px-4 text-xs md:text-sm font-medium tracking-wide">
        🎉 সীমিত সময়ের অফার! মূল্য <span className="line-through opacity-70">৫২০ টাকা</span> → <span className="font-bold text-yellow-300 text-sm md:text-base">৩৯০ টাকা</span> — আজই অর্ডার করুন!
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6 py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-zinc-950/80 to-zinc-950 z-10" />
          <Image src="/hero_banner.png" alt="Hero" fill className="object-cover opacity-40" unoptimized />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <div className="hero-badge inline-flex items-center gap-1.5 py-1.5 px-3 md:py-2 md:px-5 rounded-full glass-premium text-[10px] md:text-xs font-bold mb-5 md:mb-8 text-blue-300 border border-blue-500/20 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 glow-blue animate-pulse" />
              Magic Publication BD — অফিসিয়াল স্টোর
            </div>
            <h1 className="hero-title text-2xl sm:text-3xl md:text-5xl xl:text-6xl font-black mb-4 md:mb-6 leading-[1.15] tracking-tight">
              সময়কে নিয়ন্ত্রণ করুন,<br />
              <span className="text-gradient drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">সফলতাকে নিজের করুন।</span>
            </h1>
            <p className="hero-sub text-sm md:text-lg text-zinc-400 mb-7 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Magic Daily Planner আপনাকে প্রতিদিন ফোকাসড, সংগঠিত ও প্রোডাক্টিভ থাকতে সাহায্য করবে। ৬ মাসের জন্য একটি পারফেক্ট প্ল্যানিং জার্নি।
            </p>
            <div className="hero-cta flex flex-wrap gap-4 md:gap-6 items-center justify-center lg:justify-start">
              <Link href="#checkout" className="shimmer-btn inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm md:text-base px-6 py-3.5 md:px-10 md:py-5 rounded-xl md:rounded-2xl transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] active:scale-95">
                <ShoppingCart size={18} className="drop-shadow md:hidden" /><ShoppingCart size={22} className="drop-shadow hidden md:block" /> এখনই অর্ডার করুন <ArrowRight size={16} className="md:hidden" /><ArrowRight size={20} className="hidden md:block" />
              </Link>
              <div className="flex flex-col items-center lg:items-start group">
                <span className="text-2xl md:text-4xl font-black text-white group-hover:text-blue-400 transition-colors">৩৯০ <span className="text-base md:text-xl font-bold text-zinc-400">টাকা</span></span>
                <span className="text-sm md:text-base text-zinc-500 line-through decoration-red-500/50">৫২০ টাকা</span>
              </div>
            </div>
          </div>
          {/* Book Image */}
          <div className="book-float hidden lg:flex justify-center perspective-1000">
            <div className="relative w-[420px] h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-[100px] animate-pulse" />
              <Image src="/middle_section.png" alt="Magic Daily Planner Book" fill className="object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,0.6)] transform-gpu" unoptimized />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-zinc-900/40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center fade-up">
          {[
            { target: 200, suffix: "+", label: "ডেইলি পেজ", icon: <BookOpen size={20} className="text-blue-400" /> },
            { target: 6, suffix: " মাস", label: "পরিকল্পনার সময়কাল", icon: <Clock size={20} className="text-purple-400" /> },
            { target: 8, suffix: "টি", label: "ফিচার বিভাগ", icon: <Target size={20} className="text-pink-400" /> },
            { target: 500, suffix: "+", label: "খুশি কাস্টমার", icon: <Star size={20} className="text-yellow-400" /> },
          ].map((s, i) => (
            <div key={i} className="group cursor-default">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-500">
                {s.icon}
              </div>
              <div className="text-2xl md:text-5xl font-black text-gradient mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                <span className="stat-number" data-target={s.target}>0</span>{s.suffix}
              </div>
              <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="py-14 md:py-20 px-4 md:px-6 fade-up">
        <div className="max-w-4xl mx-auto glass rounded-2xl md:rounded-3xl p-3 md:p-6 border-white/10 shadow-2xl overflow-hidden">
          <video
            className="w-full aspect-video rounded-2xl bg-zinc-900"
            controls
            preload="none"
            poster="/video/611c9a87-7e83-4a66-aed5-1d79eac74ff7.jpg"
            playsInline
          >
            <source src="/video/WhatsApp Video 2026-03-09 at 2.55.09 PM.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-16 md:py-32 px-4 md:px-6 fade-up">
        <div className="max-w-5xl mx-auto">
          <div className="glass-premium rounded-3xl md:rounded-[40px] p-6 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px]" />

            <div className="relative z-10 text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight">আপনি কি এই সমস্যাগুলোর মধ্যে আছেন?</h2>
              <div className="w-20 h-1 bg-red-500/50 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
              {[
                "কাজ শুরু করেন, কিন্তু শেষ করতে পারেন না",
                "সময় নষ্ট হয়ে যায়, বুঝতেই পারেন না",
                "অনেক লক্ষ্য আছে, কিন্তু পরিষ্কার পরিকল্পনা নেই",
                "দিন শেষে মনে হয় কিছুই অর্জন হয়নি",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3 md:gap-4 bg-zinc-950/40 border border-red-500/10 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:border-red-500/30 transition-all duration-300 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500 font-black text-sm md:text-lg group-hover:bg-red-500/20 transition-colors">✕</div>
                  <span className="text-zinc-300 text-sm md:text-xl font-medium leading-snug">{p}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-white/10 rounded-2xl md:rounded-[32px] p-5 md:p-10 text-center shadow-2xl">
              <div className="inline-flex items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs md:text-sm font-bold uppercase tracking-wider">Solution</div>
              <p className="text-lg md:text-3xl font-bold text-white mb-1.5 md:mb-2 leading-tight">সমস্য আপনার ইচ্ছাশক্তিতে না…</p>
              <p className="text-lg md:text-3xl font-bold text-gradient leading-tight">সমস্য হলো সঠিক প্ল্যানিং সিস্টেম নেই।</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO + PHOTO ── */}
      <section className="py-14 md:py-24 px-4 md:px-6 relative overflow-hidden fade-up">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden glass border-white/10 group" style={{ aspectRatio: "4/5" }}>
            <Image src="/book_showcase.png" alt="Magic Planner View" fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="glass px-4 py-2 rounded-full text-sm font-medium border-white/10 text-blue-300">✨ প্রিমিয়াম কোয়ালিটি</div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
              <span className="text-gradient">Daily Planner</span><br />কেন ব্যবহার করবেন?
            </h2>
            <p className="text-base md:text-xl text-zinc-300 mb-6 md:mb-8 leading-relaxed">
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
      <section className="py-14 md:py-24 px-4 md:px-6 bg-zinc-900/40 border-y border-zinc-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16 fade-up">
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">প্ল্যানারটি দেখুন</h2>
            <p className="text-base md:text-xl text-zinc-400">আসল প্রোডাক্টের ছবি — ঠিক যেমনটা পাবেন</p>
          </div>
          <div className="flex justify-center">
            <div className="group rounded-3xl overflow-hidden glass border border-white/10 hover:border-blue-500/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer max-w-3xl w-full">
              <div className="relative aspect-[16/10]">
                <Image src="/OriginalProduct/89507505-e686-481f-b45f-54bff3188720.jpg" alt="আসল Magic Daily Planner" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-sm font-medium text-zinc-200 bg-zinc-900/70 px-4 py-2 rounded-full">Magic Daily Planner — আসল প্রোডাক্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-14 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16 fade-up">
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">ভিতরে কী কী আছে?</h2>
            <p className="text-base md:text-xl text-zinc-400">একটি প্ল্যানারে ৮টি শক্তিশালী বিভাগ</p>
          </div>
          <div className="feat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "ইয়ারলি প্ল্যানার", desc: "১ পৃষ্ঠা", icon: <Package size={24} />, color: "from-blue-500/20 via-blue-600/5 to-transparent", glow: "blue-500" },
              { title: "মান্থলি প্ল্যানার", desc: "৬ মাসের ৬ পৃষ্ঠা", icon: <Clock size={24} />, color: "from-purple-500/20 via-purple-600/5 to-transparent", glow: "purple-500" },
              { title: "বাজেট প্ল্যানার", desc: "মাসিক + দৈনিক বাজেট", icon: <Target size={24} />, color: "from-green-500/20 via-green-600/5 to-transparent", glow: "green-500" },
              { title: "উইকলি প্ল্যানার", desc: "২৫ সপ্তাহের ২৫ পৃষ্ঠা", icon: <ChartBar size={24} />, color: "from-yellow-500/20 via-yellow-600/5 to-transparent", glow: "yellow-500" },
              { title: "গ্রোথ ট্র্যাকার", desc: "দৈনিক পারফরম্যান্স", icon: <Zap size={24} />, color: "from-orange-500/20 via-orange-600/5 to-transparent", glow: "orange-500" },
              { title: "ডেইলি প্ল্যানার", desc: "২০০ পৃষ্ঠা, ২৫ সপ্তাহ", icon: <BookOpen size={24} />, color: "from-pink-500/20 via-pink-600/5 to-transparent", glow: "pink-500" },
              { title: "নোটবুক", desc: "১২ পৃষ্ঠা", icon: <Star size={24} />, color: "from-cyan-500/20 via-cyan-600/5 to-transparent", glow: "cyan-500" },
              { title: "ক্যালেন্ডার", desc: "ছয় মাসের জার্নি", icon: <ArrowRight size={24} />, color: "from-violet-500/20 via-violet-600/5 to-transparent", glow: "violet-500" },
            ].map((f, i) => (
              <div key={i} className={`feat-card glass-premium p-5 md:p-8 rounded-2xl md:rounded-[32px] border-white/5 bg-gradient-to-br ${f.color} transition-all duration-500 hover:-translate-y-2 hover:border-white/20 group cursor-default`}>
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-${f.glow}/10 flex items-center justify-center mb-4 md:mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-base md:text-xl font-black mb-1.5 md:mb-2 text-white group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed">{f.desc}</p>
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
      <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 border-y border-blue-500/20 fade-up">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block text-3xl md:text-4xl mb-3 md:mb-4">🎯</div>
          <h2 className="text-xl md:text-4xl font-bold mb-3 md:mb-4">আজই শুরু করুন আপনার প্রডাক্টিভ জার্নি!</h2>
          <p className="text-zinc-300 text-sm md:text-lg mb-6 md:mb-8">মাত্র <span className="text-yellow-300 font-bold">৩৯০ টাকায়</span> পান ৬ মাসের জন্য একটি সম্পূর্ণ প্ল্যানিং সিস্টেম।</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-black text-white">৩৯০<span className="text-lg md:text-2xl font-medium text-zinc-300"> টাকা</span></div>
              <div className="text-zinc-500 line-through text-sm md:text-lg">৫২০ টাকা</div>
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
      <section className="py-14 md:py-24 fade-up overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">নমুনা পৃষ্ঠা</h2>
            <p className="text-base md:text-xl text-zinc-400">প্ল্যানারের ভিতরের কিছু পাতার ঝলক — আসল প্রোডাক্টের ছবি</p>
          </div>
        </div>
        {(() => {
          const images = [
            "/samplePages/fcbb3a23-bed3-4b70-8fb7-bcf95b2c0561.jpg",
            "/samplePages/c4d4d317-2041-4571-a879-9127fa38e979.jpg",
            "/samplePages/05566ca5-916a-4292-8ad4-35d2fc4d923b.jpg",
            "/samplePages/fda48822-0ba2-4847-8096-e7fa4263bf0d.jpg",
            "/samplePages/b3e57fa2-c64f-4a32-b94a-b607c07c4d76.jpg",
            "/samplePages/a83b9e82-9966-4ce6-8c0e-56ca315c220d.jpg",
            "/samplePages/828ccf56-1eb0-4125-9f8e-ac3abbd788c7.jpg",
            "/samplePages/62f5de93-2263-494e-8179-264decf23e44.jpg",
            "/samplePages/f89e35cf-8412-4079-9629-0d40ae3587d4.jpg",
            "/samplePages/2aa3762f-9b90-41e7-9b72-de338f79b479.jpg",
            "/samplePages/242a0847-734b-49f8-a415-39c732389166.jpg",
            "/samplePages/36cfd080-8724-4c23-94c4-dc2e5ce6071d.jpg",
            "/samplePages/1079dee6-9ef6-4d3b-8378-717605451b8e.jpg",
            "/samplePages/249a2cd5-d0ef-49df-8da3-c05c7091eeca.jpg",
            "/samplePages/dccc9da0-14b1-4b0e-bb81-5bef8f1edb00.jpg",
            "/samplePages/1d732c63-c1e4-4527-8941-87ab0dc15cfb.jpg",
            "/samplePages/978fd123-d770-4219-9445-67b50c71a63d.jpg",
            "/samplePages/2a4a2109-5b3a-4153-a2b0-66ff306a204a.jpg",
          ];
          const doubled = [...images, ...images];
          return (
            <div className="relative" style={{ height: "clamp(260px, 40vw, 420px)" }}>
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />
              <div ref={carouselTrackRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                {doubled.map((src, i) => (
                  <div key={i} className="carousel-card absolute top-0 left-0 w-[160px] md:w-[260px] rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 will-change-transform" style={{ aspectRatio: "3/4" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Sample page" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-zinc-950 relative overflow-hidden fade-up">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-2xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight">কাস্টমারদের কথা</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
            <p className="text-zinc-500 text-lg mt-6 font-medium">যারা ইতিমধ্যে ব্যবহার শুরু করেছেন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "রাফিউল ইসলাম", role: "উদ্যোক্তা", review: "এই প্ল্যানারটি আমার ব্যবসার পরিকল্পনা করতে অনেক সাহায্য করছে। প্রতিদিনের টাস্ক লিস্ট থেকে শুরু করে মাসিক রিভিউ পর্যন্ত সব কিছু গুছানো আছে।", rating: 5, color: "from-blue-500 to-indigo-600" },
              { name: "সুমাইয়া আক্তার", role: "বিশ্ববিদ্যালয় ছাত্রী", review: "পড়াশোনার সময় ম্যানেজমেন্টে এটা খুবই কাজে দিচ্ছে। বাজেট ট্র্যাকার সেকশনটা বিশেষভাবে দরকারী।", rating: 5, color: "from-purple-500 to-pink-600" },
              { name: "মোহাম্মদ তানভীর", role: "চাকরিজীবী", review: "অফিসের কাজ এবং ব্যক্তিগত জীবন দুটোই এখন সুসংগঠিত। প্রতিদিন মনে হচ্ছে কাজ শেষ হচ্ছে, উদ্বেগ কমেছে।", rating: 5, color: "from-indigo-500 to-blue-600" },
            ].map((t, i) => (
              <div key={i} className="glass-premium p-6 md:p-10 rounded-2xl md:rounded-[40px] border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2">
                <div>
                  <div className="flex gap-1.5 mb-5 md:mb-8">
                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />)}
                  </div>
                  <p className="text-zinc-300 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 font-medium italic">&ldquo;{t.review}&rdquo;</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center font-black text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-black text-white text-lg tracking-tight">{t.name}</div>
                    <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDER FORM ── */}
      <section id="checkout" className="py-16 md:py-32 px-4 md:px-6 fade-up relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <div className="glass-premium rounded-3xl md:rounded-[40px] overflow-hidden border-blue-500/20 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)]">
            <div className="h-1.5 md:h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            <div className="p-5 md:p-16">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-widest">
                  <Package size={14} /> Secure Checkout
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight">আপনার অর্ডার দিন</h2>
                <div className="flex items-baseline justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <span className="text-4xl md:text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">৩৯০</span>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-zinc-400">টাকা</span>
                    <div className="text-zinc-600 line-through text-lg font-medium">৫২০ টাকা</div>
                  </div>
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-black px-3 py-1.5 rounded-xl self-center">২৫% ছাড়</span>
                </div>
                <p className="text-zinc-500 text-sm font-medium">ডেলিভারি চার্জ ৬০–১০০ টাকা (ক্যাশ অন ডেলিভারি)</p>
              </div>
              <CheckoutForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-14 md:pt-24 pb-8 md:pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12 md:mb-20">
            {/* Brand */}
            <div>
              <div className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 tracking-tighter">Magic Publication<br /><span className="text-blue-500">BD</span></div>
              <p className="text-zinc-500 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-medium">আমরা বিশ্বাস করি সঠিক পরিকল্পনাই সফলতার চাবিকাঠি। আমাদের Daily Planner আপনার প্রতিটি দিনকে অর্থবহ করে তুলবে।</p>
              <div className="flex items-center gap-3 py-2 px-4 bg-zinc-900/50 rounded-2xl border border-white/5 w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 glow-blue animate-pulse" />
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">অর্ডার নেওয়া হচ্ছে</span>
              </div>
            </div>
            {/* Links */}
            <div>
              <div className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-8">প্রোডাক্ট ম্যাপ</div>
              <ul className="space-y-4">
                <li><a href="#checkout" className="text-zinc-400 hover:text-blue-400 font-bold transition-all flex items-center gap-2 group"><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> Daily Planner অর্ডার করুন</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-blue-400 font-bold transition-all flex items-center gap-2 group"><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> নমুনা পৃষ্ঠা দেখুন</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-blue-400 font-bold transition-all flex items-center gap-2 group"><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> ফিচারস সম্পর্কে জানুন</a></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <div className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-8">যোগাযোগ করুন</div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-zinc-300 font-bold mb-1">যেকোনো প্রশ্ন থাকলে কল করুন</div>
                    <a href="tel:+8801972653480" className="text-zinc-500 text-sm font-medium hover:text-blue-400 transition-colors">+880 1972-653480</a>
                    <div className="text-zinc-400 text-[10px] mt-1 font-medium">অর্ডার ও তথ্যের জন্য সরাসরি কথা বলুন</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-zinc-300 font-bold mb-1">সারা বাংলাদেশে হোমি ডেলিভারি</div>
                    <div className="text-zinc-500 text-sm font-medium">ক্যাশ অন ডেলিভারি সুবিধা আছে</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-sm font-bold text-zinc-600 uppercase tracking-widest">
            <p>© ২০২৬ Magic Publication BD. সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-6">
              <span className="text-zinc-400 font-black">৩৯০ টাকা <span className="text-zinc-700 line-through ml-2">৫২০ টাকা</span></span>
              <div className="w-px h-4 bg-zinc-800" />
              <a href="#checkout" className="text-blue-500 hover:text-white transition-colors">এখনই অর্ডার করুন →</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
