"use client";
import Header from "@/components/main/home/Header";
import ScrollAreaBody from "@/components/main/home/ScrollAreaBody";

export default function ContactsListPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-50 p-0 text-zinc-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white sm:p-4 md:p-6">
      {/* Glow Effects (روشن‌تر در لایت، عمیق‌تر در دارک) */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[380px] w-[380px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/30 sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-[350px] w-[350px] rounded-full bg-cyan-400/20 blur-[130px] dark:bg-cyan-500/15 sm:h-[400px] sm:w-[400px] sm:blur-[140px]" />

      {/* Main Glass Card Container */}
      <section className="relative flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden border border-zinc-200/80 bg-white/70 shadow-2xl shadow-slate-200/60 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-black/45 dark:shadow-blue-950/50 sm:h-[calc(100dvh-3rem)] sm:rounded-3xl">
        <Header />
        <ScrollAreaBody />
      </section>
    </main>
  );
}
