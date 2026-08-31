"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSignalR } from "@/hooks/useSignalR";
import { useState } from "react";

type ChatMessage = {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
};

const MessagesList = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>();

   useSignalR("ReceiveMessage", messages => {
    setChatMessages(messages)
   });

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="mx-auto my-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] text-zinc-400">
          Today
        </div>

        {chatMessages?.map((chatMessage) => (
          <div
            key={chatMessage.id}
            className={`flex max-w-[85%] flex-col px-4 py-2.5 text-sm leading-7 sm:max-w-[75%] ${
              chatMessage.isMe
                ? "self-end rounded-2xl rounded-br-sm bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-950/30"
                : "self-start rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.07] text-zinc-100"
            }`}
          >
            <span>{chatMessage.text}</span>
            <span
              className={`mt-0.5 self-end text-[10px] ${
                chatMessage.isMe ? "text-blue-100/75" : "text-zinc-500"
              }`}
            >
              {chatMessage.time}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
