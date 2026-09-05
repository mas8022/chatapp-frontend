"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ThemeToggleBtn = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = (e: React.MouseEvent | Event) => {
    e.preventDefault();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={toggleTheme}
      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800/80 focus:text-white focus:bg-zinc-800/80 transition-colors select-none"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative size-4">
          <Sun className="absolute inset-0 size-4 text-amber-400 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 size-4 text-blue-400 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
        </div>
        <span>Theme</span>
      </div>

    </DropdownMenuItem>
  );
};

export default ThemeToggleBtn;
