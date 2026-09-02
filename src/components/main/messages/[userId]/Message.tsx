"use client";

import { PVMessageType } from "@/types/PVMessage";
import formatDate from "@/utils/formatDate";
import {
  Mic,
  ZoomIn,
  Trash2,
  Edit3,
  CornerUpLeft,
  Video,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ReplyBtn from "./ReplyBtn";

type PropsType = {
  receiverId: string;
  message: PVMessageType;
  setPreviewMedia: Dispatch<SetStateAction<string | null>>;
  onReply?: (message: PVMessageType) => void;
};

const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov|mkv)$/i.test(url);
};

const isAudioUrl = (url: string) => {
  return /\.(mp3|wav|ogg|m4a|webm|aac)$/i.test(url);
};

const Message = ({
  receiverId,
  message,
  setPreviewMedia,
  onReply,
}: PropsType) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  const isMe = Number(receiverId) !== message.senderId;
  const hasMedia = Boolean(message.mediaUrl);
  const isAudio = hasMedia && isAudioUrl(message.mediaUrl!);
  const isVideo = hasMedia && !isAudio && isVideoUrl(message.mediaUrl!);
  const isImage = hasMedia && !isAudio && !isVideo;

  useEffect(() => {
    const handleHighlight = (e: CustomEvent<{ messageId: number }>) => {
      if (e.detail?.messageId === message.id) {
        setIsHighlighted(true);
        const timer = setTimeout(() => {
          setIsHighlighted(false);
        }, 2200);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener(
      "highlight-reply-message",
      handleHighlight as EventListener,
    );

    return () => {
      window.removeEventListener(
        "highlight-reply-message",
        handleHighlight as EventListener,
      );
    };
  }, [message.id]);

  const handleScrollToRepliedMessage = (replyId: number) => {
    const targetElement = document.getElementById(`msg-${replyId}`);
    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.dispatchEvent(
      new CustomEvent("highlight-reply-message", {
        detail: { messageId: replyId },
      }),
    );
  };

  const renderReplyPreviewContent = () => {
    if (!message.replyTo) return null;

    if (message.replyTo.text) {
      return <span className="line-clamp-1">{message.replyTo.text}</span>;
    }

    if (message.replyTo.mediaUrl) {
      if (isAudioUrl(message.replyTo.mediaUrl)) {
        return (
          <span className="flex items-center gap-1">
            <Mic className="size-3 text-sky-400" />
            پیام صوتی
          </span>
        );
      }
      if (isVideoUrl(message.replyTo.mediaUrl)) {
        return (
          <span className="flex items-center gap-1">
            <Video className="size-3 text-sky-400" />
            ویدیو
          </span>
        );
      }
      return (
        <span className="flex items-center gap-1">
          <ImageIcon className="size-3 text-sky-400" />
          عکس
        </span>
      );
    }

    return <span>پیام</span>;
  };

  return (
    <div
      id={`msg-${message.id}`}
      className={`group relative my-1 flex max-w-[88%] flex-col transition-all duration-300 sm:max-w-[72%] ${
        isMe ? "self-end items-end" : "self-start items-start"
      } ${isHighlighted ? "z-20 scale-[1.02]" : "z-0"}`}
    >
      {/* بج شناور شیشه‌ای روی پیام تارگت */}
      <div
        className={`pointer-events-none absolute -top-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-sky-400/40 bg-sky-950/80 px-3 py-1 text-[11px] font-medium text-sky-200 shadow-lg shadow-sky-500/20 backdrop-blur-md transition-all duration-300 ${
          isHighlighted
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-2 opacity-0 scale-90"
        }`}
      >
        <Sparkles
          className="size-3 animate-spin text-sky-300"
          style={{ animationDuration: "3s" }}
        />
        <span>پیام پاسخ داده شده</span>
      </div>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`relative cursor-pointer overflow-hidden rounded-2xl select-none transition-all duration-500 ${
              isMe
                ? "rounded-tr-xs bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/30"
                : "rounded-tl-xs border border-white/10 bg-zinc-900/90 text-zinc-100 shadow-md shadow-black/40 backdrop-blur-xl"
            } ${
              isHighlighted
                ? "ring-2 ring-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.5)] brightness-110"
                : ""
            } ${
              hasMedia && !message.text && !isAudio && !message.replyTo
                ? "p-1.5"
                : "p-2.5 sm:p-3"
            }`}
          >
            {/* پیش‌نمایش Reply داخل پیام */}
            {message.replyTo && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrollToRepliedMessage(message.replyTo!.id);
                }}
                className={`mb-2 flex cursor-pointer items-stretch gap-2.5 rounded-xl border-s-2 px-2.5 py-1.5 text-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  isMe
                    ? "border-sky-300 bg-black/25 text-blue-100 hover:bg-black/35"
                    : "border-sky-500 bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-300">
                    <CornerUpLeft className="size-3" />
                    <span>پاسخ به</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs opacity-85">
                    {renderReplyPreviewContent()}
                  </div>
                </div>
              </div>
            )}

            {/* ویس */}
            {isAudio && (
              <div className="flex min-w-[220px] flex-col gap-1.5 p-1 sm:min-w-[260px]">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <div className="size-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>پیام صوتی</span>
                </div>
                <audio
                  src={message.mediaUrl!}
                  controls
                  preload="metadata"
                  className="h-9 w-full rounded-lg accent-sky-500"
                />
              </div>
            )}

            {/* عکس و ویدیو */}
            {hasMedia && !isAudio && (
              <div className="relative mb-1 overflow-hidden rounded-xl bg-black/40">
                {isVideo ? (
                  <video
                    src={message.mediaUrl!}
                    controls
                    preload="metadata"
                    className="max-h-80 w-full rounded-xl object-cover"
                  />
                ) : isImage ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMedia(message.mediaUrl!);
                    }}
                    className="group/img relative cursor-pointer overflow-hidden rounded-xl"
                  >
                    <Image
                      src={message.mediaUrl!}
                      alt="Attachment"
                      width={500}
                      height={300}
                      className="max-h-80 w-full rounded-xl object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover/img:opacity-100">
                      <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                        <ZoomIn className="size-5 text-white drop-shadow" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* متن پیام */}
            {message.text && (
              <p className="break-words whitespace-pre-wrap px-1 text-sm leading-relaxed font-normal tracking-wide">
                {message.text}
              </p>
            )}

            {/* زمان ارسال */}
            <div
              className={`flex items-center justify-end gap-1 px-1 pt-1 text-[10px] font-medium select-none ${
                isMe ? "text-blue-200/70" : "text-zinc-500"
              }`}
            >
              <span>{formatDate(message.time)}</span>
            </div>
          </div>
        </ContextMenuTrigger>

        {/* منوی کلیک راست */}
        <ContextMenuContent className="w-52 rounded-2xl border-zinc-800/80 bg-zinc-900/95 p-1.5 text-zinc-200 shadow-2xl backdrop-blur-xl animate-in fade-in-80 zoom-in-95">
          <ReplyBtn onClick={() => onReply?.(message)} />

          {isMe && message.text && (
            <ContextMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/80 focus:bg-zinc-800 focus:text-white">
              <Edit3 className="size-4 text-amber-400" />
              <span>ویرایش پیام</span>
            </ContextMenuItem>
          )}

          {isMe && (
            <>
              <ContextMenuSeparator className="my-1 bg-zinc-800/80" />
              <ContextMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10 focus:bg-rose-500/15 focus:text-rose-300">
                <Trash2 className="size-4 text-rose-500" />
                <span>حذف پیام</span>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default Message;
