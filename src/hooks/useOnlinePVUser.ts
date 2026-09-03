import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSignalR } from "./useSignalR";
import { HubConnection } from "@microsoft/signalr";

interface PresencePayload {
  userId: number;
  isOnline: boolean;
}

const useOnlinePVUser = (receiverUserId = "", signal: HubConnection | null) => {
  const params = useParams();
  const receiverId = (params?.userId as string) ?? String(receiverUserId);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useSignalR("UserPresenceChanged", (data: PresencePayload) => {
    if (String(data.userId) === String(receiverId)) {
      setIsOnline(data.isOnline);
    }
  });

  useEffect(() => {
    // اگر سیگنال آماده نبود یا receiverId وجود نداشت کاری نکن
    if (!signal || !receiverId) return;

    const targetUserId = parseInt(receiverId, 10);
    if (isNaN(targetUserId)) return;

    let isMounted = true;

    const subscribe = async () => {
      try {
        // وضعیت اولیه را استعلام و همزمان سابسکرایب می‌کنیم
        const currentStatus: boolean = await signal.invoke(
          "SubscribeToUserPresence",
          targetUserId,
        );

        if (isMounted) {
          setIsOnline(currentStatus);
        }
      } catch {}
    };

    if (signal.state === "Connected") {
      subscribe();
    }

    return () => {
      isMounted = false;
      if (signal.state === "Connected") {
        signal.invoke("UnsubscribeFromUserPresence", targetUserId);
      }
    };
  }, [signal, signal?.state, receiverId]);

  return { isOnline };
};

export default useOnlinePVUser;
