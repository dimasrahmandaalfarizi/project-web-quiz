"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { NeoInput } from "@/components/ui/NeoInput";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Star, Gamepad2 } from "lucide-react";

type GameState = "JOIN" | "WAITING" | "PLAYING" | "PODIUM" | "STATS";

export default function QuizPage() {
  const [gameState, setGameState] = useState<GameState>("JOIN");
  const [username, setUsername] = useState("");
  
  // Mock Play State
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Auto transition for mockup purposes
  useEffect(() => {
    if (gameState === "WAITING") {
      const t = setTimeout(() => setGameState("PLAYING"), 3000);
      return () => clearTimeout(t);
    }
    
    if (gameState === "PLAYING" && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    } else if (gameState === "PLAYING" && timeLeft === 0) {
      const t = setTimeout(() => setGameState("PODIUM"), 0);
      return () => clearTimeout(t);
    }
  }, [gameState, timeLeft]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setGameState("WAITING");
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    // Mock correct answer logic
    const isCorrect = index === 1; // Always option B for mock
    if (isCorrect) {
      const baseScore = 1000;
      const speedBonus = timeLeft * 10;
      const streakBonus = streak * 100;
      setScore(prev => prev + baseScore + speedBonus + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Move to next step in mock
    setTimeout(() => {
      setGameState("PODIUM");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
      <AnimatePresence mode="wait">
        
        {/* 1. JOIN SCREEN */}
        {gameState === "JOIN" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <NeoCard className="flex flex-col gap-6 text-center border-8">
              <div className="mx-auto bg-[var(--color-neo-accent)] p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#000] rotate-3 mb-4">
                <Gamepad2 className="w-12 h-12" />
              </div>
              <h1 className="text-4xl font-black">Join Live Quiz!</h1>
              <p className="font-bold text-gray-600">Tidak perlu login, cukup masukkan nickname-mu.</p>
              
              <form onSubmit={handleJoin} className="flex flex-col gap-4 mt-4">
                <NeoInput 
                  placeholder="Masukkan Nickname..." 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-center text-xl"
                  maxLength={15}
                  required
                />
                <NeoButton type="submit" variant="primary" size="lg" className="w-full text-xl py-4">
                  GAS MAIN! 🚀
                </NeoButton>
              </form>
            </NeoCard>
          </motion.div>
        )}

        {/* 2. WAITING ROOM */}
        {gameState === "WAITING" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl font-black animate-pulse">Bersiap-siap...</h2>
            <div className="inline-block bg-white px-8 py-4 border-4 border-black shadow-[8px_8px_0px_#1a1a1a] rounded-2xl">
              <span className="text-3xl font-bold">{username}</span>
            </div>
            <p className="text-xl font-bold text-gray-600">Menunggu host memulai quiz...</p>
          </motion.div>
        )}

        {/* 3. PLAYING SCREEN */}
        {gameState === "PLAYING" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col gap-8"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-white p-4 border-4 border-black shadow-[4px_4px_0px_#000] rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-[var(--color-neo-accent)] p-2 rounded-lg border-2 border-black">
                  <Star className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500">SCORE</span>
                  <span className="text-xl font-black">{score}</span>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                <div className="bg-[var(--color-neo-primary)] text-white w-20 h-20 flex items-center justify-center rounded-full border-4 border-black shadow-[4px_4px_0px_#000]">
                  <span className="text-3xl font-black">{timeLeft}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-500">STREAK</span>
                  <span className="text-xl font-black text-[var(--color-neo-primary)]">{streak}x 🔥</span>
                </div>
              </div>
            </div>

            {/* Question */}
            <NeoCard className="text-center py-12 border-8">
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Apa tujuan utama pembuatan project ini?
              </h2>
            </NeoCard>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Mencari Keuntungan', 'Media Pembelajaran Interaktif', 'Bikin Website Biasa', 'Tidak Ada Tujuan'].map((opt, i) => {
                const colors = ['bg-[var(--color-neo-primary)]', 'bg-[var(--color-neo-secondary)]', 'bg-[var(--color-neo-accent)]', 'bg-[var(--color-neo-green)]'];
                const isSelected = selectedAnswer === i;
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    onClick={() => selectedAnswer === null && handleAnswer(i)}
                    className={`
                      ${colors[i]} text-black p-6 rounded-2xl border-4 border-black text-2xl font-black text-left
                      ${selectedAnswer === null ? 'shadow-[4px_4px_0px_#000] cursor-pointer' : ''}
                      ${isSelected ? 'scale-95 shadow-none' : ''}
                      ${selectedAnswer !== null && !isSelected ? 'opacity-50 grayscale' : ''}
                      transition-all
                    `}
                  >
                    <span className="bg-white/30 px-3 py-1 rounded-lg border-2 border-black mr-4">
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 4. PODIUM SCREEN */}
        {gameState === "PODIUM" && (
          <motion.div
            key="podium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl text-center space-y-12"
          >
            <h2 className="text-5xl font-black">🏆 Hasil Akhir 🏆</h2>
            
            <div className="flex justify-center items-end h-64 gap-4 px-4">
              {/* Rank 2 */}
              <motion.div 
                initial={{ height: 0 }} animate={{ height: '60%' }} transition={{ delay: 0.5 }}
                className="w-1/3 bg-[var(--color-neo-secondary)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
              >
                <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">Player 2</div>
                <span className="text-4xl font-black mt-4">2</span>
              </motion.div>
              
              {/* Rank 1 */}
              <motion.div 
                initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ delay: 1 }}
                className="w-1/3 bg-[var(--color-neo-accent)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
              >
                <div className="absolute -top-20 bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000] font-black text-xl rounded-xl whitespace-nowrap">{username}</div>
                <Trophy className="absolute -top-10 w-12 h-12 text-[var(--color-neo-primary)]" />
                <span className="text-5xl font-black mt-8">1</span>
              </motion.div>

              {/* Rank 3 */}
              <motion.div 
                initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ delay: 0.2 }}
                className="w-1/3 bg-[var(--color-neo-green)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
              >
                <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">Player 3</div>
                <span className="text-4xl font-black mt-4">3</span>
              </motion.div>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <NeoButton onClick={() => setGameState("STATS")} variant="white">
                Lihat Statistik Saya
              </NeoButton>
              <NeoButton onClick={() => window.location.href="/"} variant="primary">
                Kembali ke Home
              </NeoButton>
            </div>
          </motion.div>
        )}

        {/* 5. STATS SCREEN */}
        {gameState === "STATS" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <NeoCard className="flex flex-col items-center gap-8 border-8 p-12">
              <h2 className="text-4xl font-black">Statistik Kamu</h2>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Total Score</span>
                  <span className="text-4xl font-black">{score}</span>
                </div>
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Ranking Akhir</span>
                  <span className="text-4xl font-black">#1</span>
                </div>
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Benar</span>
                  <span className="text-4xl font-black text-[var(--color-neo-green)]">10</span>
                </div>
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Salah</span>
                  <span className="text-4xl font-black text-[var(--color-neo-primary)]">0</span>
                </div>
              </div>

              <NeoButton onClick={() => window.location.href="/"} variant="primary" size="lg" className="w-full mt-4">
                Selesai
              </NeoButton>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
