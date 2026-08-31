import { UserType } from "@/types/user";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useGetUsersBySearch = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isPending } = useQuery<UserType[]>({
    queryKey: ["get-users-by-search", search],

    queryFn: async () => {
      const response = await api.get(`/users/search?search=${search}`);
      return response.data;
    },

    enabled: search.trim().length > 0,
  });

  return { users, isPending, search, setSearch };
};

export default useGetUsersBySearch;
