"use client";

import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { NeoInput } from "@/components/ui/NeoInput";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Play, SkipForward, Trophy, Plus, Settings, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";

type HostState = "LOBBY" | "PLAYING" | "LEADERBOARD" | "FINISHED";
type PlayerData = { id: string; username: string; score: number; avatar: string };
type QuestionData = { id?: string; text: string; options: string[]; correct_index: number; time_limit: number };

export default function HostQuizPage() {
  const [hostState, setHostState] = useState<HostState>("LOBBY");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [roomCode, setRoomCode] = useState<string>("LOADING...");
  const [roomId, setRoomId] = useState<string>("");

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQText, setNewQText] = useState("");
  const [newQOptions, setNewQOptions] = useState(["", "", "", ""]);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQTime, setNewQTime] = useState(30);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: true });
      if (data) setQuestions(data);
    };
    fetchQuestions();

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
              setPlayers((prev) => [...prev, payload.new as PlayerData]);
            }
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'players', filter: `room_id=eq.${data.id}` },
            (payload) => {
              // Update score when player answers
              setPlayers((prev) => prev.map(p => p.id === payload.new.id ? payload.new as PlayerData : p));
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

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText || newQOptions.some(opt => !opt.trim())) {
      alert("Harap isi pertanyaan dan semua opsi!");
      return;
    }
    const { data, error } = await supabase.from('questions').insert([{
      text: newQText,
      options: newQOptions,
      correct_index: newQCorrect,
      time_limit: newQTime
    }]).select().single();

    if (data && !error) {
      setQuestions(prev => [...prev, data]);
      setNewQText("");
      setNewQOptions(["", "", "", ""]);
      setNewQCorrect(0);
      setShowAddForm(false);
    } else {
      console.error(error);
      alert("Gagal menyimpan pertanyaan: " + error?.message);
    }
  };

  const deleteQuestion = async (id?: string) => {
    if (!id) return;
    if (!confirm("Hapus soal ini?")) return;
    await supabase.from('questions').delete().eq('id', id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const startGame = async () => {
    if (!roomId || questions.length === 0) return;
    const { error } = await supabase.from('rooms').update({ status: 'PLAYING', current_question: 0 }).eq('id', roomId);
    if (error) {
      console.error("Start game error:", error);
      alert("Gagal memulai kuis: " + error.message);
      return;
    }
    setHostState("PLAYING");
    setCurrentQuestionIdx(0);
  };

  const nextQuestion = async () => {
    if (!roomId) return;
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx >= questions.length) {
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

  const currentQ = questions[currentQuestionIdx];

  // Sort players by score for leaderboard view
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
      <div className="w-full max-w-5xl px-4">
        {/* Header Admin */}
        <div className="flex justify-between items-center bg-black text-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_#ff5252] mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-[var(--color-neo-primary)] text-white px-2 py-1 rounded font-bold text-sm">HOST</span>
            <span className="font-black text-xl hidden md:inline">Kontrol Panel Kuis</span>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Left Column: Room Code & Players */}
              <div className="flex flex-col gap-8">
                <NeoCard className="text-center py-12 border-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-4 bg-[var(--color-neo-green)]"></div>
                  <h1 className="text-4xl font-black mb-4">Lobby Quiz</h1>
                  <p className="font-bold text-gray-600 mb-6">Minta peserta untuk join sekarang!</p>
                  
                  <div className="inline-block bg-[var(--color-neo-bg)] px-8 py-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_#000] mb-8">
                    <span className="text-sm font-bold text-gray-500 block mb-2">KODE ROOM</span>
                    <span className="text-5xl font-black tracking-widest">{roomCode}</span>
                  </div>

                  <div className="flex justify-center">
                    <NeoButton 
                      variant="primary" 
                      size="lg" 
                      className="flex items-center gap-2 text-xl py-4 px-8 w-full justify-center"
                      onClick={startGame}
                      disabled={roomCode === "LOADING..." || roomCode === "ERROR" || players.length === 0 || questions.length === 0}
                    >
                      <Play className="w-6 h-6 fill-current" /> MULAI KUIS
                    </NeoButton>
                  </div>
                  {questions.length === 0 && (
                    <p className="text-red-500 font-bold mt-4 text-sm">*Anda belum menambahkan soal</p>
                  )}
                </NeoCard>

                <div>
                  <h3 className="font-black text-2xl mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" /> Peserta ({players.length})
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-gray-500 font-bold italic">Belum ada peserta yang bergabung...</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {players.map((p) => (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
                          key={p.id} 
                          className="bg-white border-2 border-black rounded-lg px-4 py-2 font-bold shadow-[2px_2px_0px_#000]"
                        >
                          <span className="mr-2">{p.avatar || '🦊'}</span>{p.username}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Manage Questions */}
              <div className="flex flex-col gap-4">
                <h3 className="font-black text-2xl flex items-center gap-2">
                  <Settings className="w-6 h-6" /> Daftar Soal ({questions.length})
                </h3>
                
                <div className="bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_#000] flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                  {questions.map((q, i) => (
                    <div key={q.id || i} className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50 relative pr-10">
                      <button 
                        onClick={() => deleteQuestion(q.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white border-2 border-black p-1 rounded shadow-[2px_2px_0px_#000]"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <p className="font-black mb-2">{i + 1}. {q.text}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`p-2 rounded border ${q.correct_index === oIdx ? 'bg-[var(--color-neo-green)] border-black' : 'bg-white border-gray-300'}`}>
                            {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {showAddForm ? (
                    <form onSubmit={addQuestion} className="border-2 border-black p-4 rounded-xl bg-[var(--color-neo-bg)] flex flex-col gap-4">
                      <div>
                        <label className="font-bold text-sm">Pertanyaan:</label>
                        <NeoInput required value={newQText} onChange={e => setNewQText(e.target.value)} placeholder="Masukkan soal..." />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <label className="font-bold text-sm">Opsi Jawaban:</label>
                        {newQOptions.map((opt, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="font-black">{['A','B','C','D'][idx]}</span>
                            <NeoInput required value={opt} onChange={e => {
                              const newOpts = [...newQOptions];
                              newOpts[idx] = e.target.value;
                              setNewQOptions(newOpts);
                            }} placeholder={`Opsi ${['A','B','C','D'][idx]}`} />
                            <input 
                              type="radio" 
                              name="correctAnswer" 
                              checked={newQCorrect === idx}
                              onChange={() => setNewQCorrect(idx)}
                              className="w-5 h-5 accent-black flex-shrink-0 cursor-pointer"
                            />
                          </div>
                        ))}
                        <p className="text-xs text-gray-600 font-bold italic">*Pilih radio button di kanan untuk kunci jawaban</p>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <NeoButton type="button" onClick={() => setShowAddForm(false)} variant="secondary" className="w-1/2">Batal</NeoButton>
                        <NeoButton type="submit" variant="primary" className="w-1/2">Simpan</NeoButton>
                      </div>
                    </form>
                  ) : (
                    <NeoButton onClick={() => setShowAddForm(true)} variant="secondary" className="w-full flex items-center justify-center gap-2 border-dashed border-4 border-gray-400 text-gray-600 hover:text-black hover:border-black hover:bg-[var(--color-neo-bg)]">
                      <Plus className="w-5 h-5" /> Tambah Soal
                    </NeoButton>
                  )}
                </div>
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
                <h2 className="text-3xl font-black">Pertanyaan {currentQuestionIdx + 1}/{questions.length}</h2>
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
                  const isCorrect = currentQ.correct_index === i;
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
                      <div className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center text-2xl bg-[var(--color-neo-bg)] shadow-[2px_2px_0px_#000]">
                        {p.avatar || '🦊'}
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
                    <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">
                      <span className="text-2xl mr-2">{sortedPlayers[1].avatar || '🦊'}</span>{sortedPlayers[1].username}
                    </div>
                    <span className="text-4xl font-black mt-4">2</span>
                  </motion.div>
                )}
                
                {/* Rank 1 */}
                {sortedPlayers[0] && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ delay: 1 }}
                    className="w-1/3 bg-[var(--color-neo-accent)] border-4 border-black border-b-0 rounded-t-2xl relative flex justify-center"
                  >
                    <div className="absolute -top-24 bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000] font-black text-xl rounded-xl whitespace-nowrap flex items-center flex-col">
                      <span className="text-4xl mb-1">{sortedPlayers[0].avatar || '🦊'}</span>
                      {sortedPlayers[0].username}
                    </div>
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
                    <div className="absolute -top-16 bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] font-bold rounded-xl whitespace-nowrap">
                      <span className="text-2xl mr-2">{sortedPlayers[2].avatar || '🦊'}</span>{sortedPlayers[2].username}
                    </div>
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
