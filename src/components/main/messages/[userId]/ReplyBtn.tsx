"use client";

import { ContextMenuItem } from "@/components/ui/context-menu";
import { Reply } from "lucide-react";

type ReplyBtnProps = {
  onClick: () => void;
};

const ReplyBtn = ({ onClick }: ReplyBtnProps) => {
  return (
    <ContextMenuItem
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer focus:bg-zinc-800 focus:text-zinc-100"
    >
      <Reply className="size-4 text-blue-400" />
      <span>پاسخ (Reply)</span>
    </ContextMenuItem>
  );
};

export default ReplyBtn;
