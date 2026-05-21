"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

const galleryData = [
  { id: 1, group: "1", type: "photo", url: "https://images.unsplash.com/photo-1523580494112-071dcb92a110?auto=format&fit=crop&q=80&w=800", caption: "Kegiatan Diskusi Kelompok 1" },
  { id: 2, group: "2", type: "photo", url: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800", caption: "Presentasi Kelompok 2" },
  { id: 3, group: "3", type: "photo", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800", caption: "Kerja Bakti Kelompok 3" },
  { id: 4, group: "4", type: "photo", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", caption: "Rapat Kelompok 4" },
  { id: 5, group: "1", type: "photo", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800", caption: "Belajar Bersama Kelompok 1" },
  { id: 6, group: "2", type: "photo", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", caption: "Diskusi Panel Kelompok 2" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3" | "4">("all");

  const filteredGallery = filter === "all" 
    ? galleryData 
    : galleryData.filter(item => item.group === filter);

  return (
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
          onClick={() => setFilter("all")}
        >
          Semua Kelompok
        </NeoButton>
        {(["1", "2", "3", "4"] as const).map((group) => (
          <NeoButton 
            key={group}
            variant={filter === group ? "secondary" : "white"}
            onClick={() => setFilter(group)}
          >
            Kelompok {group}
          </NeoButton>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredGallery.map((item) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={item.id}
            className="group relative rounded-xl border-4 border-black overflow-hidden bg-white shadow-[4px_4px_0px_#1a1a1a]"
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-black text-xl text-gray-400 rotate-[-10deg]">FOTO DOKUMENTASI</span>
              </div>
              <div className="absolute top-4 right-4 bg-white px-3 py-1 border-2 border-black rounded-lg font-bold text-sm shadow-[2px_2px_0px_#000]">
                Klmpk {item.group}
              </div>
            </div>
            <div className="p-4 border-t-4 border-black bg-[var(--color-neo-bg)]">
              <p className="font-bold text-lg">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
