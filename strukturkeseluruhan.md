# MASTER CONCEPT PROJECT

# Interactive Learning & Quiz Platform

# 1. LATAR BELAKANG PROJECT

Project ini dibuat sebagai platform pembelajaran interaktif berbasis website yang menggabungkan sistem pembelajaran, portfolio kelompok, dan quiz realtime dalam satu media digital modern. Website ini dibuat untuk mendukung kegiatan pengajaran agama dari 4 kelompok yang berbeda agar proses pembelajaran menjadi lebih menarik, interaktif, dan tidak membosankan.

Selain sebagai media pembelajaran, website ini juga berfungsi sebagai portfolio digital yang menampilkan dokumentasi kegiatan kelompok berupa foto dan video sehingga seluruh aktivitas kelompok dapat terdokumentasi dengan baik.

Untuk meningkatkan interaksi pengguna, website juga dilengkapi dengan fitur quiz realtime ala Kahoot yang memungkinkan pengguna bermain quiz secara kompetitif menggunakan sistem leaderboard realtime.

---

# 2. TUJUAN PROJECT

Tujuan dibuatnya website ini adalah:

* Membuat media pembelajaran yang modern dan interaktif
* Menampilkan materi pembelajaran dari setiap kelompok
* Menampilkan dokumentasi kegiatan kelompok
* Membuat quiz pembelajaran menjadi lebih seru dan kompetitif
* Menggabungkan pembelajaran dan hiburan dalam satu platform
* Memberikan pengalaman belajar yang lebih menarik bagi mahasiswa dan anak muda

---

# 3. KONSEP WEBSITE

Website menggunakan konsep:

### Interactive Learning Platform

yang menggabungkan:

* materi pembelajaran
* portfolio kelompok
* quiz realtime
* leaderboard kompetitif

dengan tampilan:

### Neobrutalism UI

agar website memiliki identitas visual yang unik, modern, playful, dan menarik untuk anak muda.

---

# 4. TARGET USER

Target pengguna website:

* mahasiswa
* anak muda
* peserta pembelajaran agama
* dosen atau pengajar
* pengunjung kegiatan kelompok

---

# 5. KONSEP UI/UX

## Tema UI

Menggunakan:

### Neobrutalism

## Karakter UI

* border hitam tebal
* hard shadow
* warna vibrant
* typography bold
* layout playful
* card interaktif
* button besar
* animasi modern

## Tujuan UI

* membuat website tidak membosankan
* meningkatkan interaksi pengguna
* memberikan pengalaman modern
* memberikan nuansa fun namun tetap edukatif

---

# 6. FITUR WEBSITE

# LANDING PAGE

## Fungsi

Sebagai halaman utama website yang menampilkan identitas project dan navigasi menuju seluruh fitur.

## Isi

* hero section
* nama project
* deskripsi singkat
* tombol navigasi
* preview fitur website

---

# HALAMAN MATERI

## Fungsi

Menampilkan materi pembelajaran dari 4 kelompok pengajaran agama.

## Fitur

* tab kelompok
* PDF/image slide viewer
* navigasi slide
* deskripsi materi

## Struktur

* Kelompok 1
* Kelompok 2
* Kelompok 3
* Kelompok 4

---

# HALAMAN GALLERY

## Fungsi

Menampilkan dokumentasi kegiatan kelompok.

## Fitur

* gallery foto
* gallery video
* filter kelompok
* caption kegiatan

---

# QUIZ SYSTEM

## Fungsi

Sebagai media evaluasi pembelajaran berbasis game interaktif ala Kahoot.

## Fitur

* multiple choice
* timer
* auto scoring
* next question
* realtime system

---

# USERNAME JOIN SYSTEM

## Fungsi

Pengguna dapat mengikuti quiz hanya dengan memasukkan username tanpa perlu login atau registrasi.

## Alur

Masukkan Username
↓
Join Quiz
↓
Main Quiz

---

# LIVE LEADERBOARD

## Fungsi

Menampilkan ranking pemain secara realtime berdasarkan score tertinggi.

## Fitur

* realtime ranking
* auto update score
* sorting score
* top player display

---

# FAST ANSWER BONUS

## Fungsi

Pemain yang menjawab lebih cepat mendapatkan score lebih besar.

## Tujuan

* meningkatkan kompetisi
* meningkatkan interaksi pemain
* membuat quiz lebih seru

---

# ANSWER STREAK

## Fungsi

Memberikan bonus score apabila pemain menjawab benar secara berturut-turut.

## Fitur

* combo point
* streak counter
* bonus score

---

# ANIMATION SYSTEM

## Fungsi

Membuat interaksi website menjadi lebih modern dan hidup.

## Fitur

* hover animation
* transition animation
* popup score
* leaderboard animation

---

# NICKNAME COLOR

## Fungsi

Setiap pemain memiliki warna username berbeda secara otomatis.

## Tujuan

* mempermudah identifikasi pemain
* membuat leaderboard lebih menarik

---

# PODIUM WINNER SCREEN

## Fungsi

Menampilkan 3 pemain terbaik setelah quiz selesai.

## Fitur

* podium ranking
* winner animation
* top 3 player

---

# QUIZ STATISTICS

## Fungsi

Menampilkan hasil permainan pemain setelah quiz selesai.

## Fitur

* total score
* total benar
* total salah
* ranking akhir

---

# RESPONSIVE MOBILE DESIGN

## Fungsi

Membuat website tetap nyaman digunakan di perangkat mobile maupun desktop.

## Fitur

* responsive layout
* responsive leaderboard
* responsive quiz UI
* adaptive component

---

# 7. TEKNOLOGI YANG DIGUNAKAN

# FRONTEND

## Next.js

Digunakan untuk:

* membangun keseluruhan frontend website
* routing halaman
* realtime interaction
* modern web architecture

## Tailwind CSS

Digunakan untuk:

* styling UI
* membuat desain Neobrutalism
* responsive layout

## Framer Motion

Digunakan untuk:

* animation system
* smooth transition
* hover effect

---

# BACKEND

## Supabase

Digunakan untuk:

* database
* realtime leaderboard
* realtime quiz
* media storage
* penyimpanan data pemain

---

# DATABASE

## PostgreSQL (Supabase)

Digunakan untuk:

* menyimpan data quiz
* menyimpan score
* menyimpan leaderboard
* menyimpan data materi
* menyimpan gallery

---

# STORAGE

## Supabase Storage

Digunakan untuk menyimpan:

* foto
* video
* PDF materi
* dokumentasi kelompok

---

# 8. STRUKTUR DATABASE

## users

Menyimpan data pemain.

Field:

* id
* username
* score
* streak
* room_id

---

## rooms

Menyimpan room quiz.

Field:

* id
* room_code
* status

---

## questions

Menyimpan soal quiz.

Field:

* id
* question
* option_a
* option_b
* option_c
* option_d
* correct_answer

---

## answers

Menyimpan jawaban pemain.

Field:

* id
* player_id
* question_id
* selected_answer
* is_correct

---

## materi

Menyimpan file materi kelompok.

Field:

* id
* kelompok
* title
* file_url

---

## gallery

Menyimpan media gallery kelompok.

Field:

* id
* kelompok
* media_url
* media_type
* caption

---

# 9. STRUKTUR FRONTEND

```text id="llzjlv"
src/
 ├ app/
 ├ components/
 ├ sections/
 ├ hooks/
 ├ lib/
 ├ animations/
 ├ services/
 ├ styles/
 └ utils/
```

---

# 10. ALUR WEBSITE

Landing Page
↓
Pilih Materi
↓
Belajar Materi
↓
Lihat Gallery
↓
Masukkan Username
↓
Join Quiz
↓
Menjawab Soal
↓
Score Update Realtime
↓
Leaderboard
↓
Podium Winner
↓
Statistik Quiz

---

# 11. TARGET HASIL AKHIR

Website yang dihasilkan diharapkan:

* modern
* realtime
* responsive
* interaktif
* educational
* kompetitif
* menarik untuk anak muda
* memiliki pengalaman seperti Kahoot
* memiliki identitas visual yang unik
* menjadi media pembelajaran yang tidak membosankan
