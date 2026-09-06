"use client";
import { PVMessageType } from "@/types/PVMessage";
import ResType from "@/types/response";
import api from "@/utils/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PvMessagesPage = {
  messages: PVMessageType[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
};

const useGetPVMessages = () => {
  const [chatMessages, setChatMessages] = useState<PVMessageType[]>([]);

  const { userId: receiverId } = useParams<{ userId: string }>();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<PvMessagesPage>({
    queryKey: ["pv-messages", receiverId],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;

      const res: ResType = await api.get(`/chat/pv-messages/${receiverId}`, {
        params: {
          page,
          pageSize: 20,
        },
      });

      return res.data as PvMessagesPage;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    enabled: Boolean(receiverId),
  });

  useEffect(() => {
    if (!data) return;
    const allFetchedMessages = data.pages.flatMap((page) => page.messages);
    setChatMessages(allFetchedMessages);
  }, [data]);

  return {
    chatMessages,
    setChatMessages,
    fetchPreviousMessages: fetchNextPage,
    hasMore: hasNextPage,
    isFetchingPrevious: isFetchingNextPage,
    isLoading: isLoading,
    isError: isError,
    error: error,
  };
};

export default useGetPVMessages;
