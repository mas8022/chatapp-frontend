import ResType from "@/types/response";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type UserType = {
  id: number;
  username: string;
  name?: string;
  avatar?: string;
};

const useGetUserById = () => {
  const { userId } = useParams();

  const { data: user, isPending } = useQuery<UserType | null>({
    queryKey: [`get-user-by-id-${userId}`],
    queryFn: async () => {
      const res: ResType = await api.get(`/users/${userId}`);
      return res.data;
    },
  });

  return { user, isPending };
};

export default useGetUserById;
