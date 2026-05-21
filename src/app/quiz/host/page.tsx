"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Play, SkipForward, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { QUIZ_QUESTIONS } from "@/lib/questions";

type HostState = "LOBBY" | "PLAYING" | "LEADERBOARD" | "FINISHED";

export default function HostQuizPage() {
  const [hostState, setHostState] = useState<HostState>("LOBBY");
  const [players, setPlayers] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [roomCode, setRoomCode] = useState<string>("LOADING...");
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    const createRoom = async () => {
      // Generate random 5-letter code
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      const { data, error } = await supabase
        .from('rooms')
        .insert([{ code, status: 'LOBBY', current_question: 0 }])
        .select()
        .single();
        
      if (data && !error) {
        setRoomCode(data.code);
        setRoomId(data.id);
        
        // Subscribe to players table changes for this room
        const channel = supabase.channel(`room-${data.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'players', filter: `room_id=eq.${data.id}` },
            (payload) => {
              setPlayers((prev) => [...prev, payload.new]);
            }
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'players', filter: `room_id=eq.${data.id}` },
            (payload) => {
              // Update score when player answers
              setPlayers((prev) => prev.map(p => p.id === payload.new.id ? payload.new : p));
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        console.error("Error creating room:", error);
        setRoomCode("ERROR");
      }
    };

    createRoom();
  }, []);

  const startGame = async () => {
    if (!roomId) return;
    await supabase.from('rooms').update({ status: 'PLAYING', current_question: 0 }).eq('id', roomId);
    setHostState("PLAYING");
    setCurrentQuestionIdx(0);
  };

  const nextQuestion = async () => {
    if (!roomId) return;
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx >= QUIZ_QUESTIONS.length) {
      await supabase.from('rooms').update({ status: 'FINISHED' }).eq('id', roomId);
      setHostState("FINISHED");
    } else {
      await supabase.from('rooms').update({ status: 'PLAYING', current_question: nextIdx }).eq('id', roomId);
      setHostState("PLAYING");
      setCurrentQuestionIdx(nextIdx);
    }
  };

  const showLeaderboard = async () => {
    if (!roomId) return;
    await supabase.from('rooms').update({ status: 'LEADERBOARD' }).eq('id', roomId);
    setHostState("LEADERBOARD");
    
    // Refresh players data to get latest scores sorted
    const { data } = await supabase.from('players').select('*').eq('room_id', roomId).order('score', { ascending: false });
    if (data) setPlayers(data);
  };

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];

  // Sort players by score for leaderboard view
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

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
                  <span className="text-5xl font-black tracking-widest">{roomCode}</span>
                </div>

                <div className="flex justify-center">
                  <NeoButton 
                    variant="primary" 
                    size="lg" 
                    className="flex items-center gap-2 text-2xl py-4 px-12"
                    onClick={startGame}
                    disabled={roomCode === "LOADING..." || roomCode === "ERROR" || players.length === 0}
                  >
                    <Play className="w-8 h-8 fill-current" /> MULAI KUIS
                  </NeoButton>
                </div>
              </NeoCard>

              <div>
                <h3 className="font-black text-2xl mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" /> Peserta ({players.length})
                </h3>
                {players.length === 0 ? (
                  <p className="text-gray-500 font-bold italic">Belum ada peserta yang bergabung...</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {players.map((p, i) => (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
                        key={p.id} 
                        className="bg-white border-2 border-black rounded-lg px-4 py-2 font-bold shadow-[2px_2px_0px_#000]"
                      >
                        {p.username}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 2. PLAYING SCREEN */}
          {hostState === "PLAYING" && currentQ && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black">Pertanyaan {currentQuestionIdx + 1}/{QUIZ_QUESTIONS.length}</h2>
                <NeoButton 
                  variant="secondary" 
                  className="flex items-center gap-2"
                  onClick={showLeaderboard}
                >
                  <SkipForward className="w-5 h-5" /> Ke Leaderboard
                </NeoButton>
              </div>

              <NeoCard className="text-center py-16 border-8 bg-[var(--color-neo-bg)]">
                <h2 className="text-4xl md:text-5xl font-black leading-tight max-w-3xl mx-auto">
                  {currentQ.text}
                </h2>
              </NeoCard>

              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((opt, i) => {
                  const colors = ['bg-[var(--color-neo-primary)]', 'bg-[var(--color-neo-secondary)]', 'bg-[var(--color-neo-accent)]', 'bg-[var(--color-neo-green)]'];
                  const isCorrect = currentQ.correctIndex === i;
                  return (
                    <div key={i} className={`${colors[i]} text-black p-6 rounded-2xl border-4 border-black text-2xl font-black relative ${isCorrect ? 'border-dashed' : ''}`}>
                      <span className="bg-white/30 px-3 py-1 rounded-lg border-2 border-black mr-4 text-xl inline-block mb-2">
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <br/>
                      {opt}
                      {isCorrect && <span className="absolute top-2 right-2 text-sm bg-white px-2 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000]">Jawaban Benar</span>}
                    </div>
                  );
                })}
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
                {sortedPlayers.map((p, i) => (
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.1 }}
                    key={p.id} 
                    className="flex items-center justify-between bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_#1a1a1a]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black bg-gray-100">
                        {i + 1}
                      </div>
                      <span className="text-2xl font-black">{p.username}</span>
                    </div>
                    <span className="text-2xl font-black">{p.score} pts</span>
                  </motion.div>
                ))}
                
                {sortedPlayers.length === 0 && (
                  <p className="text-center font-bold text-gray-500">Belum ada skor yang tercatat.</p>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <NeoButton variant="primary" size="lg" onClick={nextQuestion}>
                  Pertanyaan Selanjutnya
                </NeoButton>
              </div>
            </motion.div>
          )}

          {/* 4. FINISHED SCREEN */}
          {hostState === "FINISHED" && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl text-center space-y-12"
            >
              <h2 className="text-5xl font-black">🏆 Hasil Akhir Kuis 🏆</h2>
              
              <div className="flex justify-center items-end h-64 gap-4 px-4">
                {/* Rank 2 */}
                {sortedPlayers[1] && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: '60%' }} transition={{ delay: 0.5 }}
                    className="w-1/3 bg-[var(--color-neo-secondary)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
                  >
                    <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">{sortedPlayers[1].username}</div>
                    <span className="text-4xl font-black mt-4">2</span>
                  </motion.div>
                )}
                
                {/* Rank 1 */}
                {sortedPlayers[0] && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ delay: 1 }}
                    className="w-1/3 bg-[var(--color-neo-accent)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
                  >
                    <div className="absolute -top-20 bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000] font-black text-xl rounded-xl whitespace-nowrap">{sortedPlayers[0].username}</div>
                    <Trophy className="absolute -top-10 w-12 h-12 text-[var(--color-neo-primary)]" />
                    <span className="text-5xl font-black mt-8">1</span>
                  </motion.div>
                )}

                {/* Rank 3 */}
                {sortedPlayers[2] && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ delay: 0.2 }}
                    className="w-1/3 bg-[var(--color-neo-green)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
                  >
                    <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">{sortedPlayers[2].username}</div>
                    <span className="text-4xl font-black mt-4">3</span>
                  </motion.div>
                )}
              </div>
              
              <p className="font-bold mt-8 text-xl">Kuis telah selesai. Terima kasih!</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
