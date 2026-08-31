"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetUsersBySearch from "@/hooks/useGetUsersBySearch";
import { Loader2, MoreVertical, Search } from "lucide-react";

const Header = () => {
  const { users, isPending, search, setSearch } = useGetUsersBySearch();

  const shouldShowDropdown = search.trim().length > 0;

  return (
    <div className="border-b border-white/10 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>

          <p className="mt-1 text-xs text-zinc-400">
            Your recent conversations
          </p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search contacts or usernames..."
          className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/30"
        />

        {shouldShowDropdown && (
          <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111827] p-1 shadow-xl shadow-black/40">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-zinc-400">
                <Loader2 className="size-4 animate-spin" />
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
                    className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/10"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                      {avatarLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {displayName}
                      </p>

                      {user.name && user.phone && (
                        <p className="truncate text-xs text-zinc-400">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="p-4 text-center text-sm text-zinc-400">
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
