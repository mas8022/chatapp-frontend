import ResType from "@/types/response"
import api from "@/utils/api"
import { useQuery } from "@tanstack/react-query"

const useGetMe = () => {
  const {data:isAccess, isPending} = useQuery({
    queryKey: ["me"],
    queryFn: async() => {
        const res: ResType = await api.get("/auth/refresh");

        return res.data;
    }
  })

  return {isAccess, isPending}
}

export default useGetMe