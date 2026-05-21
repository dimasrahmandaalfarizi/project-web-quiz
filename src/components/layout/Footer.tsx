export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-neo-dark)] text-white p-8 mt-auto border-t-4 border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-2xl font-black tracking-tight text-[var(--color-neo-accent)]">NeoLearn</span>
          <span className="text-sm font-bold text-gray-300">Interactive Learning & Quiz Platform</span>
        </div>
        <div className="text-sm font-bold bg-white text-black px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_#ff5252]">
          &copy; {new Date().getFullYear()} Agama Project. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
