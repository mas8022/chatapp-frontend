"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useGetPVMessages from "@/hooks/useGetPVMessages";
import { PVMessageType } from "@/types/PVMessage";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { HubConnection } from "@microsoft/signalr";

type MessagesListProps = {
  onReply: (message: PVMessageType) => void;
  signal: HubConnection | null;
};

const MessagesList = ({ onReply, signal }: MessagesListProps) => {
  const { userId: receiverId } = useParams<{ userId: string }>();
  const [chatMessages, setChatMessages] = useState<PVMessageType[]>([]);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useGetPVMessages(setChatMessages);

  useEffect(() => {
    if (!signal || !receiverId) return;

    const targetId = Number(receiverId);
    signal.invoke("JoinPrivateChat", targetId);

    const handleReceiveMessage = (newMessage: PVMessageType) => {
      setChatMessages((p = []) => {
        if (p.some((m) => m.id === newMessage.id)) return p;
        return [...p, newMessage];
      });
    };

    const handleUpdatePVMessage = (updatedMessage: {
      id: number;
      text: string;
      senderId: number;
    }) => {
      setChatMessages((p = []) =>
        p.map((m) =>
          m.id === updatedMessage.id ? { ...m, text: updatedMessage.text } : m,
        ),
      );
    };

    const handleDeletePVMessage = (messageId: number) => {
      setChatMessages((p = []) => p.filter((i) => i.id !== messageId));
    };

    signal.on("ReceiveNewMessage", handleReceiveMessage);
    signal.on("UpdatePVMessage", handleUpdatePVMessage);
    signal.on("PVMessageDeleted", handleDeletePVMessage);

    return () => {
      signal.off("ReceiveNewMessage", handleReceiveMessage);
      signal.off("UpdatePVMessage", handleUpdatePVMessage);
      signal.invoke("LeavePrivateChat", targetId);
    };
  }, [signal, receiverId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chatMessages]);

  return (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4 sm:p-6">
          <div className="mx-auto my-1 rounded-full border border-zinc-200/80 bg-zinc-200/60 px-3.5 py-1 text-[11px] font-medium text-zinc-600 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Today
          </div>

          {chatMessages?.map((m) => (
            <Message
              key={m.id}
              message={m}
              receiverId={receiverId}
              setPreviewMedia={setPreviewMedia}
              onReply={onReply}
              setChatMessages={setChatMessages}
              signal={signal}
            />
          ))}

          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* مدال لایت‌باکس بزرگنمایی عکس */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setPreviewMedia(null)}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="size-6" />
          </button>
          <Image
            src={previewMedia}
            alt="Preview"
            width={1200}
            height={800}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default MessagesList;
