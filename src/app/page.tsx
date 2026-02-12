export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1c1917] text-[#fdfcf8] p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#bc8a5f] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="text-center space-y-6 relative z-10 max-w-2xl px-4">
        <div className="inline-block px-3 py-1 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20 text-[#d4a373] text-xs font-semibold tracking-wider uppercase mb-2">
          Internal Workspace
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl font-sans text-[#fdfcf8]">
          Alaqmar <span className="text-[#d4a373]">Services</span>
        </h1>
        <p className="max-w-[600px] text-[#e6ccb2]/80 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed mx-auto font-light">
          Secure client access management and authorization system.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <a
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#fdfcf8] px-8 text-sm font-semibold text-[#1c1917] shadow-lg shadow-[#d4a373]/10 transition-all hover:bg-[#d4a373] hover:text-[#1c1917] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a373]"
          >
            Enter Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
