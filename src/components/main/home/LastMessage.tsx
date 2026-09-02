import { useSignalR } from "@/hooks/useSignalR";
import ContactType from "@/types/contact";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";

type NewMessageType = {
  id: number;
  senderId: number;
  receiverId?: number;
  text: string;
  mediaUrl?: string;
  time: string | Date; // می‌تواند رشته ISO باشد
};

const LastMessage = ({ contact }: { contact: ContactType }) => {
  const [newMessage, setNewMessage] = useState<NewMessageType>();
  const { signal } = useSignalR();

  useEffect(() => {
    if (!signal) return;

    const handler = (message: NewMessageType) => {
      // فقط اگر پیام مربوط به این مخاطب است ست شود
      if (
        message.senderId === contact.id ||
        message.receiverId === contact.id
      ) {
        setNewMessage(message);
      }
    };

    signal.on("ReceiveNewMessage", handler);

    return () => {
      signal.off("ReceiveNewMessage", handler);
    };
  }, [signal, contact.id]);

  const displayTime = newMessage?.time || contact.lastMessageTime;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-semibold text-zinc-100 group-hover:text-blue-400">
          {contact.name}
        </p>

        {/* اگر پیام جدید یا پیام قبلی وجود داشت نمایش بده */}
        {displayTime && (
          <span className="shrink-0 text-[11px] text-zinc-500">
            {formatDate(displayTime)}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="truncate text-sm text-zinc-400">
          {newMessage?.text || contact.lastMessage || "هیچ پیامی وجود ندارد"}
        </p>
      </div>
    </div>
  );
};

export default LastMessage;
