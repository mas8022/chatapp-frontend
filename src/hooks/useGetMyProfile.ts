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

const useGetMyProfile = () => {
  const { data: user, isPending } = useQuery<ProfileType>({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res: ResType = await api.get("/users/my-profile");
      return res.data;
    },
  });

  return { user, isPending };
};

export default useGetMyProfile;
