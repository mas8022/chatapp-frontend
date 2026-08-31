"use client";
import { useState } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignalR } from "@/hooks/useSignalR";
import { useParams } from "next/navigation";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const { userId } = useParams();

  const { signal } = useSignalR();

  const SendMessage = () =>
    signal?.send("SendMessage", message, Number(userId));

  return (
    <div className="border-t border-white/10 bg-black/25 p-3 backdrop-blur-xl sm:p-4">
      <div className="mx-auto flex max-w-4xl items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/10 sm:gap-2 sm:p-2">
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white"
          aria-label="Attach file"
        >
          <Paperclip className="size-5" />
        </Button>

        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              SendMessage();
            }
          }}
          placeholder="Write a message..."
          className="h-10 min-w-0 border-0 bg-transparent px-1 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0 sm:text-base"
        />

        <Button
          size="icon"
          variant="ghost"
          className="hidden shrink-0 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white sm:inline-flex"
          aria-label="Emoji"
        >
          <Smile className="size-5" />
        </Button>

        <Button
          onClick={SendMessage}
          size="icon"
          className="shrink-0 rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
          aria-label="Send message"
        >
          <SendHorizontal className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
