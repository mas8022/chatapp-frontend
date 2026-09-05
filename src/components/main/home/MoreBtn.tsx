"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import ProfileBtn from "./ProfileBtn";
import ThemeToggleBtn from "./ThemeToggleBtn";

const MoreBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-xl text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-zinc-200/80 bg-white/95 p-1.5 text-zinc-800 shadow-xl shadow-zinc-200/50 backdrop-blur-md transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-200 dark:shadow-2xl dark:shadow-black/50"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Options
        </DropdownMenuLabel>

        <ProfileBtn />

        <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

        <ThemeToggleBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreBtn;
