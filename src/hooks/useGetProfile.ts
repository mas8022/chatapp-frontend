import ResType from "@/types/response";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

type ProfileType = {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  name?: string;
  bio?: string;
};

const useGetProfile = () => {
  const { data: user, isPending } = useQuery<ProfileType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res: ResType = await api.get("/users/profile");
      return res.data;
    },
  });

  return { user, isPending };
};

export default useGetProfile;
