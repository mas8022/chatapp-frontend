"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import OnlineBox from "@/components/shared/OnlineBox";
import useGetContacts from "@/hooks/useGetContacts";
import Loader from "./Loader";
import LastMessage from "./LastMessage";

const ScrollAreaBody = () => {
  const { contacts, isPending } = useGetContacts();

  if (isPending) return <Loader />;

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-1.5 p-2.5 sm:p-3">
        {contacts?.length ? (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/messages/${contact.id}`}
              className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 hover:bg-white/6 active:scale-[0.99]"
            >
              <div className="relative shrink-0">
                <Avatar className="size-12 border border-white/15">
                  <AvatarImage
                    src={contact.avatar || undefined}
                    alt={contact.name}
                  />
                  <AvatarFallback className="bg-blue-700 text-white font-medium">
                    {contact.name?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>

                <OnlineBox receiverId={contact.id} />
              </div>

              <LastMessage contact={contact} />
            </Link>
          ))
        ) : (
          <div className="px-4 py-16 text-center text-sm text-zinc-500">
            هنوز گفت‌وگویی وجود ندارد.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ScrollAreaBody;
