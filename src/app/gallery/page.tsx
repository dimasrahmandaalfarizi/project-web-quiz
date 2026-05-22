"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

// Generate 24 photos, 6 for each group
const galleryData = Array.from({ length: 24 }).map((_, idx) => {
  const group = Math.floor(idx / 6) + 1;
  const num = (idx % 6) + 1;
  return { 
    id: idx + 1, 
    group: group.toString(), 
    type: "photo", 
    caption: `Dokumentasi Kelompok ${group} - Foto ${num}` 
  };
});

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3" | "4">("all");
  const [showSplash, setShowSplash] = useState(false);
  const [splashGroup, setSplashGroup] = useState<string>("");

  const handleFilterChange = (newFilter: "all" | "1" | "2" | "3" | "4") => {
    if (filter === newFilter) return;
    
    if (newFilter !== "all") {
      setSplashGroup(newFilter);
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        setTimeout(() => setFilter(newFilter), 400); // Wait for exit animation
      }, 1500);
    } else {
      setFilter(newFilter);
    }
  };

  const filteredGallery = filter === "all" 
    ? galleryData 
    : galleryData.filter(item => item.group === filter);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-neo-green)] text-black p-4 overflow-hidden"
          >
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8 bg-white p-6 rounded-3xl border-8 border-black shadow-[12px_12px_0px_#000]"
            >
              <ImageIcon className="w-24 h-24 text-[var(--color-neo-primary)]" />
            </motion.div>
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="text-4xl md:text-7xl font-black text-center uppercase tracking-widest bg-white px-8 py-4 border-8 border-black shadow-[8px_8px_0px_#000] rotate-[-3deg]"
            >
              Kelompok {splashGroup}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-xl font-bold bg-black text-white px-6 py-2 rounded-full border-2 border-white tracking-widest animate-pulse"
            >
              Mempersiapkan...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center gap-4 border-b-4 border-black pb-6">
        <div className="bg-[var(--color-neo-secondary)] p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black">Gallery Kegiatan</h1>
          <p className="text-gray-700 font-medium">Dokumentasi momen-momen seru dari setiap kelompok.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <NeoButton 
          variant={filter === "all" ? "secondary" : "white"} 
          onClick={() => handleFilterChange("all")}
        >
          Semua Kelompok
        </NeoButton>
        {(["1", "2", "3", "4"] as const).map((group) => (
          <NeoButton 
            key={group}
            variant={filter === group ? "secondary" : "white"}
            onClick={() => handleFilterChange(group)}
          >
            Kelompok {group}
          </NeoButton>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredGallery.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                bounce: 0.4,
                delay: (index % 6) * 0.05 
              }}
              key={item.id}
              className="group relative rounded-xl border-4 border-black overflow-hidden bg-white shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[8px_8px_0px_#1a1a1a] hover:-translate-y-1 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-300 group-hover:scale-110 group-hover:text-[var(--color-neo-primary)] transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-black text-xl text-gray-400 rotate-[-10deg] opacity-50">FOTO DOKUMENTASI</span>
                </div>
                <div className="absolute top-4 right-4 bg-[var(--color-neo-accent)] px-3 py-1 border-2 border-black rounded-lg font-black text-sm shadow-[2px_2px_0px_#000]">
                  Klmpk {item.group}
                </div>
              </div>
              <div className="p-4 border-t-4 border-black bg-white group-hover:bg-[var(--color-neo-bg)] transition-colors">
                <p className="font-bold text-lg">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      </div>
    </>
  );
}
