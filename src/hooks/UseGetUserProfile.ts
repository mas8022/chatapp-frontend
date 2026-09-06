import ResType from "@/types/response";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

type ProfileType = {
  id: number;
  username: string;
  phone: string;
  avatar?: string;
  name?: string;
  bio?: string;
};

const UseGetUserProfile = () => {
  const { userId } = useParams();

  const { data: user, isPending } = useQuery<ProfileType>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res: ResType = await api.get(`/users/user-profile/${userId}`);
      return res.data;
    },
  });

  return { user, isPending };
};

export default UseGetUserProfile;
