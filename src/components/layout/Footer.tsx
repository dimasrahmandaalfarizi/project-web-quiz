import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-neo-bg)] border-t-4 border-black relative overflow-hidden mt-12">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[var(--color-neo-primary)]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-4 lg:col-span-2">
            <div className="bg-[var(--color-neo-accent)] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] rotate-[-2deg]">
              <span className="text-3xl font-black tracking-tight text-black">RELIJION</span>
            </div>
            <p className="text-lg font-bold text-gray-800 max-w-md mt-4">
              Platform pembelajaran interaktif yang revolusioner. Menggabungkan materi pelajaran dengan keseruan live quiz ala Kahoot untuk generasi muda.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black mb-2">Navigasi Utama</h3>
            <Link href="/" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Beranda</Link>
            <Link href="/materi" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Materi Belajar</Link>
            <Link href="/gallery" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Gallery Kegiatan</Link>
            <Link href="/quiz" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Live Quiz</Link>
          </div>

          {/* Sosmed */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black mb-2">Ikuti Kami</h3>
            <div className="flex gap-4">
              <a href="https://github.com/dimasrahmandaalfarizi/project-web-quiz" target="_blank" rel="noopener noreferrer" className="bg-white p-3 border-4 border-black rounded-full hover:bg-[var(--color-neo-accent)] hover:text-white hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-lg font-bold text-black bg-white px-6 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_#1a1a1a]">
            &copy; {new Date().getFullYear()} Agama Project. All rights reserved.
          </div>
          <div className="font-bold text-gray-600">
            Dibuat dengan 🔥 untuk Kelompok Agama
          </div>
        </div>
      </div>
    </footer>
  );
}
