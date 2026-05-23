"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";


export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-neo-bg)] border-t-4 border-black relative overflow-hidden mt-12">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-4 bg-[var(--color-neo-primary)]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-4 lg:col-span-2">
            <div className="bg-[var(--color-neo-accent)] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] rotate-[-2deg]">
              <span className="text-3xl font-black tracking-tight text-black">RELIGION</span>
            </div>
            <p className="text-lg font-bold text-gray-800 max-w-md mt-4">
              Platform pembelajaran interaktif yang revolusioner. Menggabungkan materi pelajaran dengan keseruan live quiz ala Kahoot untuk generasi muda.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black mb-2">Navigasi Utama</h3>
            <Link href="/" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Beranda</Link>
            <Link href="/gallery" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Galeri Kegiatan</Link>
            <Link href="/quiz" className="font-bold text-lg hover:text-[var(--color-neo-primary)] hover:translate-x-2 transition-transform w-fit">Live Quiz</Link>
          </div>

          {/* Sosmed */}
          <div className="flex flex-col gap-4">
            {/* <h3 className="text-2xl font-black mb-2">Ikuti Kami</h3> */}
            <div className="flex gap-4">
              <a href="https://github.com/dimasrahmandaalfarizi/project-web-quiz" target="_blank" rel="noopener noreferrer" className="bg-white p-3 border-4 border-black rounded-full hover:bg-[var(--color-neo-accent)] hover:text-white hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://instagram.com/dmsrah" target="_blank" rel="noopener noreferrer" className="bg-white p-3 border-4 border-black rounded-full hover:bg-[var(--color-neo-primary)] hover:text-white hover:-translate-y-1 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Scan QR */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black mb-2">Scan & Join!</h3>
            <div className="bg-white p-3 border-4 border-black rounded-2xl w-fit shadow-[4px_4px_0px_#1a1a1a] rotate-2 hover:rotate-0 transition-transform">
              <QRCodeSVG 
                value="https://project-web-quiz.vercel.app" 
                size={120} 
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"H"} 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t-4 border-black flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-lg font-bold text-black bg-white px-6 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_#1a1a1a]">
            &copy; {new Date().getFullYear()} RELIGION Project. All rights reserved.
          </div>
          <div className="font-bold text-gray-600">
            Dibuat dengan 🔥 untuk Kelompok RELIGION
          </div>
        </div>
      </div>
    </footer>
  );
}
