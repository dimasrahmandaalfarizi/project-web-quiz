"use client";

import Link from "next/link";
import { NeoButton } from "../ui/NeoButton";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <nav 
      className={cn(
        "w-full bg-white border-b-4 border-[var(--color-neo-dark)] p-4 sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "shadow-[0px_8px_0px_#1a1a1a] py-3" : ""
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="text-3xl font-black tracking-tight group-hover:-translate-y-1 transition-transform">RELIJION</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                className="relative font-bold text-lg group"
              >
                <span className={cn(
                  "relative z-10 transition-colors",
                  isActive ? "text-[var(--color-neo-primary)]" : "text-[var(--color-neo-dark)] group-hover:text-[var(--color-neo-primary)]"
                )}>
                  {link.name}
                </span>
                {/* Active Indicator / Hover Effect */}
                <span className={cn(
                  "absolute left-0 bottom-0 w-full h-2 bg-[var(--color-neo-accent)] -z-0 -translate-y-1 transition-all",
                  isActive ? "opacity-100 h-3" : "opacity-0 group-hover:opacity-100"
                )}></span>
              </Link>
            )
          })}
          <Link href="/quiz">
            <NeoButton variant="primary" size="sm" className="ml-4">
              Join Quiz
            </NeoButton>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden flex flex-col gap-4 mt-4 pt-4 border-t-4 border-black"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "font-bold text-xl p-2 rounded-lg border-2 border-transparent transition-all",
                    isActive ? "bg-[var(--color-neo-accent)] border-black shadow-[2px_2px_0px_#000]" : "hover:bg-gray-100"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
            <Link href="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
              <NeoButton variant="primary" size="lg" className="w-full mt-2">
                Join Quiz
              </NeoButton>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
