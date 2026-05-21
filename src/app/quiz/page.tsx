"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { NeoInput } from "@/components/ui/NeoInput";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Star, Gamepad2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { QUIZ_QUESTIONS } from "@/lib/questions";

type GameState = "JOIN" | "WAITING" | "PLAYING" | "ANSWERED" | "LEADERBOARD" | "FINISHED";
type QuestionData = { id: string; text: string; options: string[]; correct_index: number; time_limit: number };

export default function QuizPage() {
  const [gameState, setGameState] = useState<GameState>("JOIN");
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const AVATARS = ['🦊', '🐰', '🐶', '🐱', '🐼', '🐯', '🦁', '🐸', '🐵', '🦄', '👽', '🤖'];
  const [avatar, setAvatar] = useState(AVATARS[0]);
  
  const [roomId, setRoomId] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  
  const currentQ = questions[currentQIndex];

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;
    
    const channel = supabase.channel(`player-room-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          const room = payload.new;
          if (room.status === 'PLAYING') {
            if (room.current_question !== currentQIndex) {
              // Pertanyaan baru
              setCurrentQIndex(room.current_question);
              setSelectedAnswer(null);
              setTimeLeft(questions[room.current_question]?.time_limit || 30);
              setGameState("PLAYING");
            } else if (gameState === "WAITING" || gameState === "LEADERBOARD") {
               // Mulai kuis dari lobby atau lanjut dari leaderboard (meski index sama)
               setGameState("PLAYING");
            }
          } else if (room.status === 'LEADERBOARD') {
            setGameState("LEADERBOARD");
          } else if (room.status === 'FINISHED') {
            setGameState("FINISHED");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, questions]);

  const updatePlayerScore = async (newScore: number, newStreak: number) => {
    if (!playerId) return;
    await supabase.from('players').update({ score: newScore, streak: newStreak }).eq('id', playerId);
  };

  // Local Timer
  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0 && selectedAnswer === null) {
      const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    } else if (gameState === "PLAYING" && timeLeft === 0 && selectedAnswer === null) {
      // Waktu habis
      setTimeout(() => {
        setSelectedAnswer(-1); // -1 artinya tidak jawab
        setGameState("ANSWERED");
        setStreak(0);
        updatePlayerScore(score, 0);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, timeLeft, selectedAnswer, score]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username.trim() || !roomCode.trim()) {
      setErrorMsg("Isi kode room dan nickname!");
      return;
    }

    // 1. Cek apakah room ada dan statusnya LOBBY
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode.toUpperCase())
      .single();

    if (roomError || !roomData) {
      setErrorMsg("Room tidak ditemukan!");
      return;
    }

    if (roomData.status !== 'LOBBY') {
      setErrorMsg("Kuis sudah dimulai atau telah selesai!");
      return;
    }

    // 2. Join the room
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .insert([{ room_id: roomData.id, username, avatar, score: 0, streak: 0 }])
      .select()
      .single();

    if (playerError || !playerData) {
      setErrorMsg("Gagal bergabung ke room.");
      return;
    }

    setRoomId(roomData.id);
    setPlayerId(playerData.id);
    setCurrentQIndex(roomData.current_question);
    
    // Fetch global questions
    const { data: qData } = await supabase.from('questions').select('*').order('created_at', { ascending: true });
    if (qData) {
      setQuestions(qData);
    }
    
    setGameState("WAITING");
  };

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    let newScore = score;
    let newStreak = streak;
    
    const isCorrect = index === currentQ.correct_index;
    if (isCorrect) {
      const baseScore = 1000;
      const speedBonus = timeLeft * 10;
      const streakBonus = streak * 100;
      const pointsEarned = baseScore + speedBonus + streakBonus;
      newScore += pointsEarned;
      newStreak += 1;
    } else {
      newStreak = 0;
    }

    setScore(newScore);
    setStreak(newStreak);
    setGameState("ANSWERED");
    
    await updatePlayerScore(newScore, newStreak);
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
              <p className="font-bold text-gray-600">Masukkan PIN Kuis dari Host.</p>
              
              {errorMsg && (
                <div className="bg-red-200 border-2 border-red-500 text-red-700 p-3 rounded font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleJoin} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`text-3xl p-2 rounded-xl border-2 border-black transition-all flex items-center justify-center ${avatar === a ? 'bg-[var(--color-neo-accent)] scale-110 shadow-[4px_4px_0px_#000] ring-2 ring-black grayscale-0 opacity-100 z-10' : 'bg-white hover:bg-gray-100 grayscale hover:grayscale-0 opacity-50 hover:opacity-100'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <NeoInput 
                  placeholder="PIN ROOM (misal: A1B2C)" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl font-black tracking-widest uppercase"
                  maxLength={6}
                  required
                />
                <NeoInput 
                  placeholder="Nickname kamu..." 
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
            <p className="text-xl font-bold text-gray-600">Anda berhasil bergabung! Menunggu Host memulai kuis...</p>
          </motion.div>
        )}

        {/* 3. PLAYING SCREEN */}
        {gameState === "PLAYING" && currentQ && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col gap-8"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-white p-4 border-4 border-black shadow-[4px_4px_0px_#000] rounded-2xl relative">
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

            {/* Question (For mobile accessibility) */}
            <div className="md:hidden bg-white border-4 border-black p-4 rounded-xl font-bold text-center">
              {currentQ.text}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
              {currentQ.options.map((opt, i) => {
                const colors = ['bg-[var(--color-neo-primary)]', 'bg-[var(--color-neo-secondary)]', 'bg-[var(--color-neo-accent)]', 'bg-[var(--color-neo-green)]'];
                const isSelected = selectedAnswer === i;
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    onClick={() => selectedAnswer === null && handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`
                      ${colors[i]} text-black p-6 md:p-12 rounded-2xl border-4 border-black text-2xl font-black text-center md:text-left
                      ${selectedAnswer === null ? 'shadow-[4px_4px_0px_#000] cursor-pointer' : ''}
                      ${isSelected ? 'scale-95 shadow-none ring-4 ring-black ring-offset-4' : ''}
                      ${selectedAnswer !== null && !isSelected ? 'opacity-50 grayscale' : ''}
                      transition-all min-h-[150px] flex items-center justify-center md:justify-start
                    `}
                  >
                    {/* Bentuk ikon bisa ditambahkan di sini, untuk sekarang pakai teks opsi */}
                    <span className="hidden md:inline-block bg-white/30 px-3 py-1 rounded-lg border-2 border-black mr-4">
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    <span className="text-xl md:text-2xl">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 4. ANSWERED WAITING SCREEN */}
        {gameState === "ANSWERED" && (
          <motion.div
            key="answered"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl text-center"
          >
            <NeoCard className="flex flex-col items-center gap-8 border-8 p-12">
              <h2 className="text-4xl font-black">
                {selectedAnswer === currentQ.correct_index ? "🎉 BENAR!" : selectedAnswer === -1 ? "⏱️ WAKTU HABIS!" : "❌ SALAH!"}
              </h2>
              <p className="text-xl font-bold text-gray-600">Menunggu Host melanjutkan kuis...</p>
              
              <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black w-full max-w-sm">
                <span className="text-gray-500 font-bold block mb-2">Skor Kamu Saat Ini</span>
                <span className="text-5xl font-black">{score}</span>
              </div>
            </NeoCard>
          </motion.div>
        )}

        {/* 5. LEADERBOARD WAITING SCREEN */}
        {gameState === "LEADERBOARD" && (
          <motion.div
            key="leaderboard-wait"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <Trophy className="w-24 h-24 text-[var(--color-neo-accent)] mx-auto animate-bounce" />
            <h2 className="text-5xl font-black">Lihat Papan Skor!</h2>
            <p className="text-xl font-bold text-gray-600">Cek posisimu di layar Host.</p>
          </motion.div>
        )}

        {/* 6. FINISHED / STATS SCREEN */}
        {gameState === "FINISHED" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <NeoCard className="flex flex-col items-center gap-8 border-8 p-12">
              <h2 className="text-4xl font-black">Kuis Selesai!</h2>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Total Skor</span>
                  <span className="text-4xl font-black">{score}</span>
                </div>
                <div className="bg-[var(--color-neo-bg)] p-6 rounded-2xl border-4 border-black flex flex-col items-center">
                  <span className="text-gray-500 font-bold mb-2">Streak Tertinggi</span>
                  <span className="text-4xl font-black">{streak}</span>
                </div>
              </div>

              <p className="text-xl font-bold text-gray-600">Lihat layar Host untuk mengetahui pemenangnya!</p>

              <NeoButton onClick={() => window.location.href="/"} variant="primary" size="lg" className="w-full mt-4">
                Kembali ke Beranda
              </NeoButton>
            </NeoCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
