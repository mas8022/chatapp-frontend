import { useSignalR } from "@/hooks/useSignalR";
import ContactType from "@/types/contact";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { Camera, Mic, Video, FileText } from "lucide-react";

type NewMessageType = {
  id: number;
  senderId: number;
  receiverId?: number;
  text?: string;
  mediaUrl?: string;
  time: string | Date;
};

const getMediaPreview = (url?: string | null) => {
  if (!url || typeof url !== "string") return null;

  const cleanUrl = url.toLowerCase().split("?")[0].trim();

  if (cleanUrl.match(/\.(jpeg|jpg|png|webp|gif|svg|bmp|ico)$/)) {
    return { label: "عکس", icon: Camera };
  }
  if (cleanUrl.match(/\.(mp4|webm|mov|mkv|avi|3gp|flv)$/)) {
    return { label: "ویدیو", icon: Video };
  }
  if (cleanUrl.match(/\.(mp3|wav|ogg|m4a|aac|opus)$/)) {
    return { label: "پیام صوتی", icon: Mic };
  }
  if (cleanUrl.match(/\.(pdf|zip|rar|tar|docx?|xlsx?|txt)$/)) {
    return { label: "فایل", icon: FileText };
  }

  return null;
};

const isPureUrl = (text?: string | null) => {
  if (!text) return false;
  return /^(https?:\/\/[^\s]+)$/i.test(text.trim());
};

const LastMessage = ({ contact }: { contact: ContactType }) => {
  const [newMessage, setNewMessage] = useState<NewMessageType>();
  const { signal } = useSignalR();

  useEffect(() => {
    if (!signal) return;

    const handler = (message: NewMessageType) => {
      if (message.senderId === contact.id) {
        setNewMessage(message);
      }
    };

    signal.on("ReceiveLastMessage", handler);

    return () => {
      signal.off("ReceiveLastMessage", handler);
    };
  }, [signal, contact.id]);

  const displayTime = newMessage?.time || contact.lastMessageTime;

  const currentText = (newMessage?.text ?? contact.lastMessage)?.trim() || "";

  const currentMediaUrl =
    newMessage?.mediaUrl ||
    (contact as { lastMessageMediaUrl?: string }).lastMessageMediaUrl ||
    (contact as { mediaUrl?: string }).mediaUrl ||
    (isPureUrl(currentText) ? currentText : undefined);

  const renderLastMessageContent = () => {
    const media = getMediaPreview(currentMediaUrl);

    if (media) {
      const hasCaption = currentText && !isPureUrl(currentText);

      const Icon = media.icon;
      return (
        <span className="flex items-center gap-1.5 truncate text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
          <Icon className="size-3.5 shrink-0 text-blue-500" />
          <span className="truncate">
            {hasCaption ? currentText : media.label}
          </span>
        </span>
      );
    }

    if (currentText.length > 0) {
      return (
        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
          {currentText}
        </span>
      );
    }

    return (
      <span className="truncate text-xs text-zinc-400 dark:text-zinc-500 sm:text-sm">
        هیچ پیامی وجود ندارد
      </span>
    );
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {contact.name}
        </p>

        {displayTime && (
          <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
            {formatDate(displayTime)}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        {renderLastMessageContent()}
      </div>
    </div>
  );
};

export default LastMessage;
