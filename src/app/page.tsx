"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BookOpen, Gamepad2, Image as ImageIcon, Users, Zap, CheckCircle2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 4 seconds
    const timer = setTimeout(() => { 
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const features = [

    {
      title: "Galeri Kegiatan",
      desc: "Lihat dokumentasi foto dan video dari setiap kegiatan kelompok.",
      icon: <ImageIcon className="w-8 h-8" />,
      color: "var(--color-neo-secondary)",
      link: "/gallery"
    },
    {
      title: "Live Quiz",
      desc: "Bermain quiz realtime ala Kahoot dan raih posisi pertama di leaderboard!",
      icon: <Gamepad2 className="w-8 h-8" />,
      color: "var(--color-neo-accent)",
      link: "/quiz"
    }
  ];

  const steps = [

    {
      title: "Join Live Quiz",
      desc: "Masukkan nickname-mu di menu Quiz. Tidak perlu ribet daftar atau bikin akun!",
      icon: <Zap className="w-6 h-6 text-black" />,
      color: "var(--color-neo-accent)"
    },
    {
      title: "Jawab Cepat & Tepat",
      desc: "Jawab pertanyaan dengan cepat untuk mendapatkan bonus skor tambahan dan pertahankan Streak-mu.",
      icon: <CheckCircle2 className="w-6 h-6 text-black" />,
      color: "var(--color-neo-green)"
    },
    {
      title: "Raih Podium Juara",
      desc: "Kumpulkan poin sebanyak-banyaknya dan jadilah pemenang di akhir sesi kuis!",
      icon: <Trophy className="w-6 h-6 text-white" />,
      color: "var(--color-neo-secondary)"
    }
  ];

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-neo-dark)] text-white p-4 overflow-hidden"
          >
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.4 }}
              className="text-3xl md:text-5xl font-black text-center mb-6 uppercase tracking-widest text-gray-200"
            >
              Terima Kasih Kepada
            </motion.h1>
            <motion.h2
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, type: "spring", bounce: 0.5 }}
              className="text-5xl md:text-8xl font-black text-center text-[var(--color-neo-primary)] underline decoration-[var(--color-neo-accent)] decoration-8 underline-offset-8 drop-shadow-[6px_6px_0px_#000]"
            >
              SMP 35 SURABAYA
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
              className="mt-16 text-gray-400 font-bold tracking-[0.3em] text-sm uppercase"
            >
              Memuat Halaman...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-24 py-8">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 relative">
        {/* Floating Decorative Elements */}
        {/* Floating Decorative Elements Removed */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 w-16 h-16 bg-[var(--color-neo-accent)] border-4 border-black shadow-[4px_4px_0px_#000] rotate-45 -z-10 hidden md:block"
        />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6 relative z-10"
        >
          <div className="inline-block bg-[var(--color-neo-accent)] text-black font-bold px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-full border-2 border-black shadow-[2px_2px_0px_#000] rotate-[-2deg]">
            Platform Sosialisasi Generasi Baru
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Sosialisasi <br />
            Jadi Lebih <span className="text-[var(--color-neo-primary)] underline decoration-[var(--color-neo-dark)] decoration-8 underline-offset-8">Seru!</span>
          </h1>
          <p className="text-xl font-medium text-gray-800 max-w-xl">
            Gabungkan aktivitas sosialisasi, portfolio kelompok, dan live quiz interaktif dalam satu platform modern yang didesain khusus untuk anak muda.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/quiz">
              <NeoButton variant="primary" size="lg" className="w-full sm:w-auto text-lg">
                Mulai Quiz Sekarang
              </NeoButton>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full relative z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[var(--color-neo-green)] translate-x-4 translate-y-4 rounded-3xl border-4 border-black" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/hero.png" 
              alt="Students Learning" 
              className="relative z-10 w-full object-cover rounded-3xl border-4 border-black aspect-[4/3]"
            />
            {/* Floating Badges */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 15 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2 } }}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20 bg-white px-3 py-2 md:px-5 md:py-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] rotate-12 cursor-pointer"
            >
              <span className="text-xl md:text-3xl font-black text-[var(--color-neo-primary)]">WOW!</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -10 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ y: { repeat: Infinity, duration: 3 } }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-20 bg-[var(--color-neo-accent)] px-4 py-2 md:px-6 md:py-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] -rotate-6 cursor-pointer"
            >
              <span className="text-sm md:text-xl font-black">100% Fun!</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Cara Kerja</h2>
          <p className="text-lg font-medium text-gray-700">Ikuti langkah mudah ini untuk merasakan pengalaman belajar terbaik.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-2 bg-black border-y-2 border-dashed border-white -z-10"></div>
          
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center gap-4 relative"
            >
              <div 
                className="w-24 h-24 rounded-full border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center relative z-10 bg-white"
              >
                <div 
                  className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center"
                  style={{ backgroundColor: step.color }}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 bg-white border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000]">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-black mt-2">{step.title}</h3>
              <p className="text-gray-700 font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] px-4 md:px-8 my-12">
        <div className="py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Fitur Unggulan</h2>
            <p className="text-lg font-medium text-gray-700">Semua yang kamu butuhkan ada di sini.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={feature.link}>
                  <NeoCard hoverable className="h-full flex flex-col items-start gap-4">
                    <div 
                      className="p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: feature.color }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-black">{feature.title}</h3>
                    <p className="text-gray-700 font-medium">{feature.desc}</p>
                  </NeoCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Call to Action */}
      <section className="py-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[var(--color-neo-dark)] rounded-3xl p-8 md:p-16 border-4 border-black shadow-[8px_8px_0px_#ff5252] text-center relative overflow-hidden"
        >
          {/* CTA Background Deco Removed */}          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Siap Untuk Menjadi <span className="text-[var(--color-neo-accent)]">Juara?</span>
            </h2>
            <p className="text-xl text-gray-300 font-medium">
              Ayo buktikan pengetahuanmu, jawab pertanyaan secepat mungkin, dan puncaki Leaderboard sekarang juga!
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/quiz">
                <NeoButton variant="accent" size="lg" className="w-full sm:w-auto text-2xl px-12 py-6 transition-transform hover:scale-105 active:scale-95">
                  GAS MAIN!
                </NeoButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
    </>
  );
}
