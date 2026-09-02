"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useGetPVMessages from "@/hooks/useGetPVMessages";
import { useSignalR } from "@/hooks/useSignalR";
import { PVMessage } from "@/types/PVMessage";
import formatDate from "@/utils/formatDate";
import { ZoomIn, X, Mic } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) && !/\.(ogg)$/i.test(url);
};

const isAudioUrl = (url: string) => {
  return /\.(mp3|wav|ogg|m4a|webm|aac)$/i.test(url);
};

const MessagesList = () => {
  const { userId: receiverId } = useParams<{ userId: string }>();
  const [chatMessages, setChatMessages] = useState<PVMessage[]>([]);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useGetPVMessages(setChatMessages);
  const { signal } = useSignalR();

  useEffect(() => {
    if (!signal || !receiverId) return;

    const targetId = Number(receiverId);
    signal.invoke("JoinPrivateChat", targetId);

    const handleReceiveMessage = (newMessage: PVMessage) => {
      setChatMessages((p = []) => [...p, newMessage]);
    };

    signal.on("ReceiveNewMessage", handleReceiveMessage);

    return () => {
      signal.off("ReceiveNewMessage", handleReceiveMessage);
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
          <div className="mx-auto my-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] text-zinc-400 backdrop-blur-md">
            Today
          </div>

          {chatMessages?.map((m) => {
            const isMe = Number(receiverId) !== m.senderId;
            const hasMedia = Boolean(m.mediaUrl);
            const isAudio = hasMedia && isAudioUrl(m.mediaUrl!);
            const isVideo = hasMedia && !isAudio && isVideoUrl(m.mediaUrl!);
            const isImage = hasMedia && !isAudio && !isVideo;

            return (
              <div
                key={m.id}
                className={`group relative flex flex-col transition-all duration-200 ${
                  isMe ? "self-end items-end" : "self-start items-start"
                } max-w-[88%] sm:max-w-[70%]`}
              >
                <div
                  className={`relative overflow-hidden shadow-md transition-shadow duration-200 hover:shadow-lg ${
                    isMe
                      ? "rounded-2xl rounded-tr-xs bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-blue-950/20"
                      : "rounded-2xl rounded-tl-xs border border-white/10 bg-zinc-900/80 text-zinc-100 backdrop-blur-md"
                  } ${hasMedia && !m.text && !isAudio ? "p-1.5" : "p-2.5 sm:p-3"}`}
                >
                  {/* بخش نمایش ویس (Audio) */}
                  {isAudio && (
                    <div className="flex flex-col gap-1.5 min-w-[220px] sm:min-w-[260px] p-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                        <Mic className="size-4 text-blue-400" />
                        <span>Voice message</span>
                      </div>
                      <audio
                        src={m.mediaUrl!}
                        controls
                        preload="metadata"
                        className="h-9 w-full rounded-lg"
                      />
                    </div>
                  )}

                  {/* بخش نمایش ویدیو یا عکس */}
                  {hasMedia && !isAudio && (
                    <div className="relative mb-1 overflow-hidden rounded-xl bg-black/40">
                      {isVideo ? (
                        <video
                          src={m.mediaUrl!}
                          controls
                          preload="metadata"
                          className="max-h-80 w-full rounded-xl object-cover"
                        />
                      ) : isImage ? (
                        <div
                          onClick={() => setPreviewMedia(m.mediaUrl!)}
                          className="group/img relative cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={m.mediaUrl!}
                            alt="Attachment"
                            width={500}
                            height={300}
                            className="max-h-80 w-full rounded-xl object-cover transition-transform duration-300 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/img:opacity-100">
                            <ZoomIn className="size-6 text-white drop-shadow" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* متن پیام */}
                  {m.text && (
                    <p className="px-1 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {m.text}
                    </p>
                  )}

                  {/* ساعت ارسال */}
                  <div
                    className={`flex items-center justify-end gap-1 px-1 pt-1 text-[10px] select-none ${
                      isMe ? "text-blue-200/80" : "text-zinc-400"
                    }`}
                  >
                    <span>{formatDate(m.time)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* مدال لایت‌باکس بزرگنمایی عکس */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setPreviewMedia(null)}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="size-6" />
          </button>
          <img
            src={previewMedia}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default MessagesList;
