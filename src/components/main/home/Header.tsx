"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import useGetUsersBySearch from "@/hooks/useGetUsersBySearch";
import { Loader2, Search } from "lucide-react";
import MoreBtn from "./MoreBtn";

const Header = () => {
  const { users, isPending, search, setSearch } = useGetUsersBySearch();

  const shouldShowDropdown = search.trim().length > 0;

  return (
    <div className="border-b border-zinc-200/80 p-4 transition-colors duration-300 dark:border-white/10 sm:p-5">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Messages
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Your recent conversations
          </p>
        </div>

        <MoreBtn />
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search contacts or usernames..."
          className="h-11 rounded-xl border-zinc-200 bg-zinc-100/80 pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:ring-blue-500/30"
        />

        {/* Dropdown Results */}
        {shouldShowDropdown && (
          <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white/95 p-1 shadow-xl shadow-zinc-200/50 backdrop-blur-md dark:border-white/10 dark:bg-[#111827]/95 dark:shadow-black/40">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-zinc-500 dark:text-zinc-400">
                <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span>Searching...</span>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => {
                const displayName =
                  user.name || user.username || user.phone || "Unknown User";

                const avatarLetter = displayName.charAt(0).toUpperCase();

                return (
                  <Link
                    key={user.id}
                    href={`/messages/${user.id}`}
                    onClick={() => setSearch("")}
                    className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-zinc-100 dark:hover:bg-white/10"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-sm">
                      {avatarLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900 dark:text-white">
                        {displayName}
                      </p>

                      {user.name && user.phone && (
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
