"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ThemeToggleBtn = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // جلوگیری از Hydration mismatch در رندر اولیه
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent | Event) => {
    e.preventDefault();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={toggleTheme}
      className="flex cursor-pointer select-none items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-colors text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white dark:focus:bg-zinc-800/80 dark:focus:text-white"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative size-4">
          <Sun className="absolute inset-0 size-4 text-amber-500 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 size-4 text-blue-500 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </div>
        <span>Theme</span>
      </div>

      {/* نمایش متن تم فعلی به عنوان راهنما */}
      {mounted && (
        <span className="text-xs font-normal capitalize text-zinc-400 dark:text-zinc-500">
          {resolvedTheme}
        </span>
      )}
    </DropdownMenuItem>
  );
};

export default ThemeToggleBtn;
