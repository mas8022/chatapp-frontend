"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useGetPVMessages from "@/hooks/useGetPVMessages";
import { PVMessageType } from "@/types/PVMessage";
import { HubConnection } from "@microsoft/signalr";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Message from "./Message";

type MessagesListProps = {
  onReply: (message: PVMessageType) => void;
  signal: HubConnection | null;
};

const MessagesList = ({ onReply, signal }: MessagesListProps) => {
  const { userId: receiverId } = useParams<{ userId: string }>();

  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const previousScrollHeightRef = useRef<number | null>(null);
  const didInitialScrollRef = useRef(false);
  const loadingPreviousRef = useRef(false);
  const shouldScrollToBottomRef = useRef(false);

  const {
    chatMessages,
    setChatMessages,
    fetchPreviousMessages,
    hasMore,
    isFetchingPrevious,
  } = useGetPVMessages();

  const getViewport = useCallback(() => {
    return scrollAreaRef.current?.querySelector<HTMLDivElement>(
      "[data-radix-scroll-area-viewport]",
    );
  }, []);

  /*
   * با عوض شدن چت، وضعیت scroll را reset می‌کنیم.
   */
  useEffect(() => {
    didInitialScrollRef.current = false;
    previousScrollHeightRef.current = null;
    loadingPreviousRef.current = false;
  }, [receiverId]);

  /*
   * Observer مربوط به بالای لیست.
   */
  useEffect(() => {
    const viewport = getViewport();
    const trigger = topTriggerRef.current;

    if (!viewport || !trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting ||
          !didInitialScrollRef.current ||
          !hasMore ||
          isFetchingPrevious ||
          loadingPreviousRef.current
        ) {
          return;
        }

        loadingPreviousRef.current = true;

        // ارتفاع فعلی را قبل از اضافه شدن پیام‌های قدیمی نگه می‌داریم.
        previousScrollHeightRef.current = viewport.scrollHeight;

        fetchPreviousMessages().catch(() => {
          loadingPreviousRef.current = false;
          previousScrollHeightRef.current = null;
        });
      },
      {
        root: viewport,
        threshold: 0.1,
        rootMargin: "100px 0px 0px 0px",
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [fetchPreviousMessages, getViewport, hasMore, isFetchingPrevious]);

  /*
   * اسکرول اولیه و حفظ موقعیت هنگام prepend شدن پیام‌ها.
   */
  useLayoutEffect(() => {
    const viewport = getViewport();

    if (!viewport || chatMessages.length === 0) return;

    const previousScrollHeight = previousScrollHeightRef.current;

    if (previousScrollHeight !== null) {
      const addedHeight = viewport.scrollHeight - previousScrollHeight;

      viewport.scrollTop += addedHeight;

      previousScrollHeightRef.current = null;
      loadingPreviousRef.current = false;
      return;
    }

    // فقط بار اول به پایین چت برو.
    if (!didInitialScrollRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
      didInitialScrollRef.current = true;
      return;
    }

    // فقط برای پیام real-time و زمانی که کاربر نزدیک پایین بوده.
    if (shouldScrollToBottomRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
      shouldScrollToBottomRef.current = false;
    }
  }, [chatMessages, getViewport]);

  useEffect(() => {
    if (!signal || !receiverId) return;

    const targetId = Number(receiverId);

    signal.invoke("JoinPrivateChat", targetId);

    const handleReceiveMessage = (newMessage: PVMessageType) => {
      const viewport = getViewport();

      if (viewport) {
        const distanceFromBottom =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

        shouldScrollToBottomRef.current = distanceFromBottom < 150;
      }

      setChatMessages((previous = []) => {
        const exists = previous.some((message) => message.id === newMessage.id);

        if (exists) return previous;

        return [...previous, newMessage];
      });
    };

    const handleUpdatePVMessage = (updatedMessage: {
      id: number;
      text: string;
      senderId: number;
    }) => {
      setChatMessages((previous = []) =>
        previous.map((message) =>
          message.id === updatedMessage.id
            ? { ...message, text: updatedMessage.text }
            : message,
        ),
      );
    };

    const handleDeletePVMessage = (messageId: number) => {
      setChatMessages((previous = []) =>
        previous.filter((message) => message.id !== messageId),
      );
    };

    signal.on("ReceiveNewMessage", handleReceiveMessage);
    signal.on("UpdatePVMessage", handleUpdatePVMessage);
    signal.on("PVMessageDeleted", handleDeletePVMessage);

    return () => {
      signal.off("ReceiveNewMessage", handleReceiveMessage);
      signal.off("UpdatePVMessage", handleUpdatePVMessage);
      signal.off("PVMessageDeleted", handleDeletePVMessage);

      signal.invoke("LeavePrivateChat", targetId);
    };
  }, [signal, receiverId, getViewport, setChatMessages]);

  return (
    <>
      <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4 sm:p-6">
          {/* IntersectionObserver این المان را مشاهده می‌کند */}
          <div ref={topTriggerRef} aria-hidden="true" className="h-px w-full" />

          {isFetchingPrevious && (
            <div className="flex h-8 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-zinc-400" />
            </div>
          )}

          <div className="mx-auto my-1 rounded-full border border-zinc-200/80 bg-zinc-200/60 px-3.5 py-1 text-[11px] font-medium text-zinc-600 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Today
          </div>

          {chatMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
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

      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setPreviewMedia(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
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
