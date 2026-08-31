import { Loader2 } from 'lucide-react';
import React from 'react'

const ChatLoading = () =>{
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#030712] p-0 text-white sm:p-4 md:p-6">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[380px] w-[380px] rounded-full bg-blue-600/30 blur-[120px] sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[130px] sm:h-[400px] sm:w-[400px] sm:blur-[140px]" />

      <section className="relative flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-black/45 shadow-2xl shadow-blue-950/50 backdrop-blur-2xl sm:h-[calc(100dvh-3rem)] sm:rounded-3xl">
        {/* Skeleton Header */}
        <header className="flex h-[72px] items-center gap-3 border-b border-white/10 bg-black/25 px-3 sm:h-[84px] sm:px-5">
          <div className="size-10 animate-pulse rounded-xl bg-white/10" />
          <div className="size-11 animate-pulse rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
          </div>
        </header>

        {/* Center Loading */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="size-16 animate-ping rounded-full bg-blue-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-blue-400" />
            </div>
          </div>
          <p className="animate-pulse text-sm text-zinc-400">
            Loading conversation...
          </p>
        </div>

        {/* Skeleton Input */}
        <div className="border-t border-white/10 bg-black/25 p-3 sm:p-4">
          <div className="h-14 animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>
      </section>
    </main>
  );
}

export default ChatLoading