"use client"
import Link from "next/link";
import { ArrowRight, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetUserById from "@/hooks/useGetUserById";
import ChatLoading from "./ChatLoading";
import { notFound } from "next/navigation";
import OnlineBox from "./OnlineBox";

const Header = () => {
  const { user, isPending } = useGetUserById();

  if (isPending) {
    return <ChatLoading />;
  }

  if (!user) {
    notFound();
  }
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/10 bg-black/25 px-3 backdrop-blur-xl sm:h-[84px] sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <Button
          asChild
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400"
          aria-label="Back to conversations"
        >
          <Link href="/">
            <ArrowRight className="size-5" />
          </Link>
        </Button>

        <div className="relative shrink-0">
          <Avatar className="size-11 border border-white/15">
            <AvatarImage
              src={user.avatar || "/images/profile.jpg"}
              alt={user.name ?? "User avatar"}
            />
            <AvatarFallback className="bg-blue-700 text-white">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          <OnlineBox />
        </div>

        <div className="min-w-0">
          <h1 className="truncate font-bold text-white">{user.name}</h1>
          <p className="mt-0.5 truncate text-xs text-blue-400">
            {user.name || user.username}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="hidden rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400 sm:inline-flex"
          aria-label="Voice call"
        >
          <Phone className="size-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="hidden rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400 sm:inline-flex"
          aria-label="Video call"
        >
          <Video className="size-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
