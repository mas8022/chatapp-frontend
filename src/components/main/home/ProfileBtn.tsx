import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";

const ProfileBtn = () => {
  return (
    <Link href={"/profile"}>
      <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800/80 focus:text-white focus:bg-zinc-800/80 transition-colors">
        <User className="size-4 text-zinc-400 group-hover:text-white" />
        <span>Profile</span>
      </DropdownMenuItem>
    </Link>
  );
};

export default ProfileBtn;
