# RELIJION 🚀

**Platform Belajar Generasi Baru** yang menggabungkan materi pembelajaran interaktif, portfolio kelompok, dan sistem Kuis *Realtime* yang seru! Didesain khusus untuk anak muda dengan gaya *Neo-Brutalism* yang tebal, asyik, dan 100% *Fun*.

![RELIJION Preview](public/hero.png)

## ✨ Fitur Utama
- **🎮 Live Realtime Quiz**: Sistem kuis multiplayer *realtime* berbasis Supabase.
  - **Host Panel**: Manajemen soal kuis (Global Question Bank), pengawasan *Live Leaderboard*, dan kontrol jalannya kuis.
  - **Self-Paced Mode**: Pemain mengerjakan soal secara mandiri di perangkat masing-masing layaknya *Quizizz*.
- **📚 Materi Interaktif**: Modul pembelajaran yang rapi dan mudah dibaca.
- **🖼️ Gallery Portfolio**: Tempat memamerkan hasil karya dan tugas kelompok.
- **🎨 Neo-Brutalism UI**: Antarmuka modern dengan animasi dinamis menggunakan *Framer Motion*.

## 🛠️ Tech Stack
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase (PostgreSQL & Realtime)](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Cara Menjalankan (Local Development)

1. Clone repositori ini:
```bash
git clone https://github.com/dimasrahmandaalfarizi/project-web-quiz.git
```

2. Install dependencies:
```bash
npm install
```

3. Siapkan *Environment Variables*:
Buat file `.env.local` di folder utama dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Jalankan server lokal:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📦 Setup Database (Supabase)
Aplikasi ini memerlukan 3 tabel utama di Supabase: `questions`, `rooms`, dan `players`. 
Anda dapat menemukan *query* lengkap untuk membuat dan mengatur tabel-tabel ini (termasuk *Row Level Security* dan *Realtime Publication*) di dalam file `schema.supabase`.

---
*Belajar Agama Jadi Lebih Seru!* 🦊
