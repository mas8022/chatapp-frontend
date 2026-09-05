import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";

const ProfileBtn = () => {
  return (
    <Link href="/profile" className="block w-full">
      <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white dark:focus:bg-zinc-800/80 dark:focus:text-white">
        <User className="size-4 text-zinc-500 transition-colors dark:text-zinc-400" />
        <span>Profile</span>
      </DropdownMenuItem>
    </Link>
  );
};

export default ProfileBtn;
