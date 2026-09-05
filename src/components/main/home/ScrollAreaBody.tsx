"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetContacts from "@/hooks/useGetContacts";
import Loader from "./Loader";
import { useSignalR } from "@/hooks/useSignalR";
import Contact from "./Contact";

const ScrollAreaBody = () => {
  const { contacts, isPending } = useGetContacts();

  const { signal } = useSignalR();

  if (isPending) return <Loader />;

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-1.5 p-2.5 sm:p-3">
        {contacts?.length ? (
          contacts.map((contact) => (
            <Contact key={contact.id} contact={contact} signal={signal} />
          ))
        ) : (
          <div className="px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
            هنوز گفت‌وگویی وجود ندارد.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ScrollAreaBody;
