import OnlineBox from "@/components/shared/OnlineBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContactType from "@/types/contact";
import { HubConnection } from "@microsoft/signalr";
import Link from "next/link";
import LastMessage from "./LastMessage";

const Contact = ({
  contact,
  signal,
}: {
  contact: ContactType;
  signal: HubConnection | null;
}) => {
  return (
    <Link
      href={`/messages/${contact.id}`}
      className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 hover:bg-zinc-100 active:scale-[0.99] dark:hover:bg-white/6"
    >
      <div className="relative shrink-0">
        <Avatar className="size-12 border border-zinc-200 dark:border-white/15">
          <AvatarImage src={contact.avatar || undefined} alt={contact.name} />
          <AvatarFallback className="bg-blue-600 font-medium text-white dark:bg-blue-700">
            {contact.name?.substring(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>

        <OnlineBox receiverId={contact.id} signal={signal} />
      </div>

      <LastMessage contact={contact} />
    </Link>
  );
};

export default Contact;
