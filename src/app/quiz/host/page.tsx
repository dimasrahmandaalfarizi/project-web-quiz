"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Users, Play, SkipForward, Trophy } from "lucide-react";

type HostState = "LOBBY" | "PLAYING" | "LEADERBOARD";

export default function HostQuizPage() {
  const [hostState, setHostState] = useState<HostState>("LOBBY");
  const [players] = useState(["Budi", "Siti", "Agus", "Dina", "Eko"]);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
      <div className="w-full max-w-5xl">
        {/* Header Admin */}
        <div className="flex justify-between items-center bg-black text-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#ff5252] mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--color-neo-primary)] text-white px-2 py-1 rounded font-bold text-sm">HOST</span>
            <span className="font-black text-xl">Kontrol Panel Kuis</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--color-neo-secondary)]" />
              <span>{players.length} Players</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* 1. LOBBY SCREEN */}
          {hostState === "LOBBY" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <NeoCard className="text-center py-12 border-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-4 bg-[var(--color-neo-green)]"></div>
                <h1 className="text-4xl md:text-6xl font-black mb-4">Lobby Quiz</h1>
                <p className="text-xl font-bold text-gray-600 mb-8">Minta peserta untuk join sekarang!</p>
                
                <div className="inline-block bg-[var(--color-neo-bg)] px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] mb-8">
                  <span className="text-sm font-bold text-gray-500 block mb-2">KODE ROOM</span>
                  <span className="text-5xl font-black tracking-widest">AGAMA24</span>
                </div>

                <div className="flex justify-center">
                  <NeoButton 
                    variant="primary" 
                    size="lg" 
                    className="flex items-center gap-2 text-2xl py-4 px-12"
                    onClick={() => setHostState("PLAYING")}
                  >
                    <Play className="w-8 h-8 fill-current" /> MULAI KUIS
                  </NeoButton>
                </div>
              </NeoCard>

              <div>
                <h3 className="font-black text-2xl mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" /> Peserta ({players.length})
                </h3>
                <div className="flex flex-wrap gap-4">
                  {players.map((p, i) => (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                      key={p} 
                      className="bg-white border-2 border-black rounded-lg px-4 py-2 font-bold shadow-[2px_2px_0px_#000]"
                    >
                      {p}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PLAYING SCREEN */}
          {hostState === "PLAYING" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black">Pertanyaan {currentQuestion}/10</h2>
                <NeoButton 
                  variant="secondary" 
                  className="flex items-center gap-2"
                  onClick={() => setHostState("LEADERBOARD")}
                >
                  <SkipForward className="w-5 h-5" /> Ke Leaderboard
                </NeoButton>
              </div>

              <NeoCard className="text-center py-16 border-8 bg-[var(--color-neo-bg)]">
                <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-3xl mx-auto">
                  Apa tujuan utama pembuatan project ini?
                </h2>
              </NeoCard>

              <div className="grid grid-cols-2 gap-4 opacity-70 pointer-events-none">
                <div className="bg-[var(--color-neo-primary)] text-black p-6 rounded-2xl border-4 border-black text-2xl font-black">A. Mencari Keuntungan</div>
                <div className="bg-[var(--color-neo-secondary)] text-black p-6 rounded-2xl border-4 border-black text-2xl font-black border-dashed">B. Media Pembelajaran Interaktif (Jawaban Benar)</div>
                <div className="bg-[var(--color-neo-accent)] text-black p-6 rounded-2xl border-4 border-black text-2xl font-black">C. Bikin Website Biasa</div>
                <div className="bg-[var(--color-neo-green)] text-black p-6 rounded-2xl border-4 border-black text-2xl font-black">D. Tidak Ada Tujuan</div>
              </div>
            </motion.div>
          )}

          {/* 3. LEADERBOARD SCREEN */}
          {hostState === "LEADERBOARD" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6 items-center"
            >
              <h2 className="text-5xl font-black mb-8 flex items-center gap-4">
                <Trophy className="w-12 h-12 text-[var(--color-neo-accent)]" /> 
                Current Standings
              </h2>

              <div className="w-full max-w-3xl flex flex-col gap-4">
                {players.map((p, i) => (
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.1 }}
                    key={p} 
                    className="flex items-center justify-between bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_#1a1a1a]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black bg-gray-100">
                        {i + 1}
                      </div>
                      <span className="text-2xl font-black">{p}</span>
                    </div>
                    <span className="text-2xl font-black">{10000 - (i * 1500)} pts</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <NeoButton variant="primary" size="lg" onClick={() => setHostState("PLAYING")}>
                  Pertanyaan Selanjutnya
                </NeoButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
