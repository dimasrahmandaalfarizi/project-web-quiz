"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Download } from "lucide-react";

const materiData = {
  "1": {
    title: "Kelompok 1: Dasar-dasar Agama",
    desc: "Mempelajari konsep dasar dan nilai-nilai fundamental keagamaan.",
    slides: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    ]
  },
  "2": {
    title: "Kelompok 2: Sejarah Agama",
    desc: "Menelusuri sejarah perkembangan agama dari masa ke masa.",
    slides: [
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800",
    ]
  },
  "3": {
    title: "Kelompok 3: Tokoh Agama",
    desc: "Mengenal tokoh-tokoh penting dan pengaruh mereka.",
    slides: [
      "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800",
    ]
  },
  "4": {
    title: "Kelompok 4: Praktik Keagamaan",
    desc: "Mempelajari praktik dan ritual keagamaan dalam kehidupan sehari-hari.",
    slides: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
    ]
  }
};

export default function MateriPage() {
  const [activeGroup, setActiveGroup] = useState<"1" | "2" | "3" | "4">("1");
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeMateri = materiData[activeGroup];

  const nextSlide = () => {
    if (currentSlide < activeMateri.slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center gap-4 border-b-4 border-black pb-6">
        <div className="bg-[var(--color-neo-primary)] p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black">Materi Belajar</h1>
          <p className="text-gray-700 font-medium">Pilih kelompok untuk melihat materi pembelajaran.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(["1", "2", "3", "4"] as const).map((group) => (
          <NeoButton 
            key={group}
            variant={activeGroup === group ? "primary" : "white"}
            onClick={() => {
              setActiveGroup(group);
              setCurrentSlide(0);
            }}
          >
            Kelompok {group}
          </NeoButton>
        ))}
      </div>

      <NeoCard className="p-0 overflow-hidden flex flex-col md:flex-row gap-0">
        <div className="flex-1 bg-[var(--color-neo-bg)] p-8 border-b-4 md:border-b-0 md:border-r-4 border-black">
          <h2 className="text-3xl font-black mb-4">{activeMateri.title}</h2>
          <p className="text-lg font-medium text-gray-700 mb-8">{activeMateri.desc}</p>
          
          <div className="flex items-center gap-4">
            <NeoButton variant="secondary" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </NeoButton>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 flex flex-col">
          <div className="relative aspect-video bg-gray-200 w-full flex items-center justify-center overflow-hidden border-b-4 border-black">
            <motion.div 
              key={`${activeGroup}-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-white flex flex-col items-center justify-center p-4 text-center"
            >
              <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
              <span className="font-black text-2xl text-gray-400">SLIDE MATERI (ILUSTRASI)</span>
              <span className="font-bold text-gray-500 mt-2">{activeMateri.title} - Slide {currentSlide + 1}</span>
            </motion.div>
          </div>
          <div className="p-4 bg-white flex justify-between items-center">
            <NeoButton 
              variant="white" 
              size="sm" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </NeoButton>
            <span className="font-bold">
              Slide {currentSlide + 1} / {activeMateri.slides.length}
            </span>
            <NeoButton 
              variant="white" 
              size="sm" 
              onClick={nextSlide}
              disabled={currentSlide === activeMateri.slides.length - 1}
              className="disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    </div>
  );
}
