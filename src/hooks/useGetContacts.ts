import ContactType from "@/types/contact";
import ResType from "@/types/response";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetContacts = () => {
  const { data: contacts, isPending } = useQuery<ContactType[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res: ResType = await api.get("/chat/contacts");

      return res.data;
    },
  });

  return { contacts, isPending };
};

export default useGetContacts;
