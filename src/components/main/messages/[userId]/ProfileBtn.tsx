import OnlineBox from "@/components/shared/OnlineBox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HubConnection } from "@microsoft/signalr";
import Link from "next/link";

type PropsType = {
  userId: number;
  avatar?: string;
  name?: string;
  signal: HubConnection | null;
};

const ProfileBtn = ({ userId, avatar, name, signal }: PropsType) => {
  return (
    <Link href={`/user-profile/${userId}`} className="relative shrink-0">
      <Avatar className="size-11 border border-zinc-200 dark:border-white/15">
        <AvatarImage
          src={avatar ?? "/images/profile.jpg"}
          alt={name ?? "User avatar"}
        />
        <AvatarFallback className="bg-blue-600 text-white dark:bg-blue-700">
          {name ? name.slice(0, 2).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>

      <OnlineBox signal={signal} />
    </Link>
  );
};

export default ProfileBtn;
