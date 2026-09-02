"use client";

import { useState } from "react";
import Header from "@/components/main/messages/[userId]/Header";
import MessageInput from "@/components/main/messages/[userId]/MessageInput";
import MessagesList from "@/components/main/messages/[userId]/MessagesList";
import { PVMessageType } from "@/types/PVMessage";

export default function SingleChatPage() {
  const [replyingTo, setReplyingTo] = useState<PVMessageType | null>(null);

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#030712] p-0 text-white sm:p-4 md:p-6">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[380px] w-[380px] rounded-full bg-blue-600/30 blur-[120px] sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[130px] sm:h-[400px] sm:w-[400px] sm:blur-[140px]" />

      <section className="relative flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-black/45 shadow-2xl shadow-blue-950/50 backdrop-blur-2xl sm:h-[calc(100dvh-3rem)] sm:rounded-3xl">
        <Header />
        <MessagesList onReply={(msg) => setReplyingTo(msg)} />
        <MessageInput
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </section>
    </main>
  );
}
