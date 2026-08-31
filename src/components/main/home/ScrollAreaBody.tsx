import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contacts } from "../../../../static-data";

const ScrollAreaBody = () => {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-1.5 p-2.5 sm:p-3">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/messages/${contact.id}`}
              className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.99]"
            >
              <div className="relative shrink-0">
                <Avatar className="size-12 border border-white/15">
                  <AvatarImage src={contact.avatar} alt={contact.name} />

                  <AvatarFallback className="bg-blue-700 text-white">
                    {contact.initials}
                  </AvatarFallback>
                </Avatar>

                {contact.online && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#07101f] bg-emerald-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-zinc-100 group-hover:text-blue-400">
                    {contact.name}
                  </p>

                  <span className="shrink-0 text-[11px] text-zinc-500">
                    {contact.time}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-zinc-400">
                    {contact.message}
                  </p>

                  {!!contact.unread && (
                    <Badge className="min-w-5 shrink-0 justify-center rounded-full bg-blue-500 px-1.5 text-[10px] text-white hover:bg-blue-500">
                      {contact.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-16 text-center text-sm text-zinc-500">
            No contacts matched your search.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ScrollAreaBody;
