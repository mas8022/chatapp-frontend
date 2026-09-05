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

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        {/* نام مخاطب: در لایت تیره (zinc-900) و در دارک روشن (zinc-100) */}
        <p className="truncate font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {contact.name}
        </p>

        {/* زمان پیام */}
        {displayTime && (
          <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
            {formatDate(displayTime)}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        {/* متن آخرین پیام */}
        <p className="truncate text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          {newMessage?.text || contact.lastMessage || "هیچ پیامی وجود ندارد"}
        </p>
      </div>
    </div>
  );
};

export default LastMessage;
