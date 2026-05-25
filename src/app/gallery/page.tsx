"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Data foto untuk KELAS 8D (12 foto dari folder public/img/8D)
const galleryData = Array.from({ length: 12 }).map((_, idx) => {
  return { 
    id: idx + 1, 
    group: "KELAS 8D", 
    type: "photo", 
    caption: `Dokumentasi KELAS 8D - Foto ${idx + 1}`,
    imageSrc: `/img/8D/img${idx + 1}.JPG`,
    isFeatured: idx === 0
  };
});

const religionData = Array.from({ length: 7 }).map((_, idx) => {
  const filename = idx === 6 ? "img 7.jpeg" : `img${idx + 1}.jpeg`;
  return {
    id: 100 + idx,
    group: "RELIGION",
    type: "photo",
    caption: `Dokumentasi RELIGION - Foto ${idx + 1}`,
    imageSrc: `/img/${filename}`,
    isFeatured: idx === 0
  };
});

// Data foto untuk BEHIND THE SCENES (29 foto dari folder public/img/BTS)
const btsData = Array.from({ length: 29 }).map((_, idx) => {
  return {
    id: 200 + idx,
    group: "BEHIND THE SCENES",
    type: "photo",
    caption: `Behind The Scene - Foto ${idx + 1}`,
    imageSrc: `/img/BTS/bts${idx + 1}.JPG`,
    isFeatured: idx === 0
  };
});

const allData = [...galleryData, ...religionData, ...btsData];

export default function GalleryPage() {
  const [filter, setFilter] = useState<"religion" | "8d" | "bts">("religion");
  const [showSplash, setShowSplash] = useState(false);
  const [splashGroup, setSplashGroup] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(6);

  const handleFilterChange = (newFilter: "religion" | "8d" | "bts") => {
    if (filter === newFilter) return;
    
    setSplashGroup(newFilter === "religion" ? "RELIGION" : (newFilter === "8d" ? "KELAS 8D" : "BEHIND THE SCENE"));
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        setFilter(newFilter);
        setVisibleCount(6); // Reset pagination on filter change
      }, 400); // Wait for exit animation
    }, 1500);
  };

  const filteredGallery = allData.filter(item => {
    if (filter === "religion") return item.group === "RELIGION";
    if (filter === "8d") return item.group === "KELAS 8D";
    if (filter === "bts") return item.group === "BEHIND THE SCENES";
    return false;
  });

  const visibleGallery = filteredGallery.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGallery.length;

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
              {splashGroup}
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
          <h1 className="text-4xl font-black">Galeri Kegiatan</h1>
          <p className="text-gray-700 font-medium">Dokumentasi momen-momen seru dari setiap kelompok.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <NeoButton 
          variant={filter === "religion" ? "secondary" : "white"} 
          onClick={() => handleFilterChange("religion")}
        >
          RELIGION
        </NeoButton>
        <NeoButton 
          variant={filter === "8d" ? "secondary" : "white"} 
          onClick={() => handleFilterChange("8d")}
        >
          KELAS 8D
        </NeoButton>
        <NeoButton 
          variant={filter === "bts" ? "secondary" : "white"} 
          onClick={() => handleFilterChange("bts")}
        >
          BEHIND THE SCENE
        </NeoButton>
      </div>

      <motion.div 
        layout
        className="columns-1 md:columns-2 lg:columns-3 gap-6 mt-4"
      >
        <AnimatePresence mode="popLayout">
          {visibleGallery.map((item, index) => {
            return (
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
              className="group relative rounded-xl border-4 border-black overflow-hidden bg-white shadow-[4px_4px_0px_#1a1a1a] hover:shadow-[8px_8px_0px_#1a1a1a] hover:-translate-y-1 transition-all break-inside-avoid inline-block w-full mb-6"
            >
              <div className="relative bg-gray-200 animate-pulse flex items-center justify-center">
                {item.imageSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={item.imageSrc} 
                    alt={item.caption} 
                    loading="lazy"
                    className="w-full h-auto object-cover opacity-0 group-hover:scale-105 transition-all duration-500" 
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      const parent = img.parentElement;
                      if (parent) {
                        parent.classList.remove('animate-pulse', 'bg-gray-200');
                        parent.classList.add('bg-white');
                        img.classList.remove('opacity-0');
                      }
                    }}
                  />
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 group-hover:scale-110 group-hover:text-[var(--color-neo-primary)] transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="font-black text-xl text-gray-400 rotate-[-10deg] opacity-50">FOTO DOKUMENTASI</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-[var(--color-neo-accent)] px-3 py-1 border-2 border-black rounded-lg font-black text-sm shadow-[2px_2px_0px_#000] z-10">
                  {item.group}
                </div>
              </div>
              <div className="p-4 border-t-4 border-black bg-white group-hover:bg-[var(--color-neo-bg)] transition-colors">
                <p className="font-bold text-lg">{item.caption}</p>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {hasMore && (
        <div className="flex justify-center pt-8">
          <NeoButton 
            variant="secondary" 
            size="lg"
            onClick={() => setVisibleCount(prev => prev + 6)}
          >
            Muat Lebih Banyak
          </NeoButton>
        </div>
      )}
      </div>
    </>
  );
}
