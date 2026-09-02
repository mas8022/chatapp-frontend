import ResType from "@/types/response";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const useGetPVMessages = (setChatMessages: (val: any[]) => void) => {
  const { userId: receiverId } = useParams();

  useQuery({
    queryKey: ["pv-messages"],
    queryFn: async () => {
      const res: ResType = await api.get(`/chat/pv-messages/${receiverId}`);
      setChatMessages(res.data);
      return res.data;
    },
  });
};

export default useGetPVMessages;
