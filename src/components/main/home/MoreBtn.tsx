"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, User, Moon, Sun } from "lucide-react";
import ProfileBtn from "./ProfileBtn";
import ThemeToggleBtn from "./ThemeToggleBtn";

const MoreBtn = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-1.5 shadow-2xl text-zinc-200"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Options
        </DropdownMenuLabel>
        <ProfileBtn />
        <DropdownMenuSeparator className="my-1 bg-zinc-850" />
        <ThemeToggleBtn/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreBtn;
