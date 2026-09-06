"use client";
import Link from "next/link";
import { ArrowRight, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetUserById from "@/hooks/useGetUserById";
import ChatLoading from "./ChatLoading";
import { notFound } from "next/navigation";
import OnlineBox from "../../../shared/OnlineBox";
import VoiceCallBtn from "./VoiceCallBtn";
import { VideoCallBtn } from "./VideoCallBtn";
import { HubConnection } from "@microsoft/signalr";
import ProfileBtn from "./ProfileBtn";

const Header = ({ signal }: { signal: HubConnection | null }) => {
  const { user, isPending } = useGetUserById();

  if (isPending) return <ChatLoading />;

  if (!user) notFound();

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-zinc-200/80 bg-white/70 px-3 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-black/25 sm:h-[84px] sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <Button
          asChild
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-xl text-zinc-600 hover:bg-blue-500/10 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-500/15 dark:hover:text-blue-400"
          aria-label="Back to conversations"
        >
          <Link href="/">
            <ArrowRight className="size-5" />
          </Link>
        </Button>

        <ProfileBtn
          userId={user.id}
          signal={signal}
          avatar={user.avatar}
          name={user.name}
        />

        <div className="min-w-0">
          <h1 className="truncate font-bold text-zinc-900 dark:text-white">
            {user.name}
          </h1>
          <p className="mt-0.5 truncate text-xs text-blue-600 dark:text-blue-400 font-mono">
            {user.name || user.username}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center sm:gap-2">
        <VoiceCallBtn
          targetUserId={user.id}
          targetUserName={user.name || user.username}
          signal={signal}
        />
        <VideoCallBtn
          targetUserId={user.id}
          targetUserName={user.name || user.username}
          signal={signal}
        />
        {/* <Button
          size="icon"
          variant="ghost"
          className="rounded-xl text-zinc-600 hover:bg-blue-500/10 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-blue-500/15 dark:hover:text-blue-400"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </Button> */}
      </div>
    </header>
  );
};

export default Header;
