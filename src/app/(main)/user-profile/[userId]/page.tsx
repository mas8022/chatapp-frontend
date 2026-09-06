"use client";
import { Phone, User, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCopy from "@/hooks/useCopy";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import UseGetUserProfile from "@/hooks/UseGetUserProfile";
import ContactProfileSkeleton from "@/components/main/user-profile/ContactProfileSkeleton";

const ContactProfileCard = () => {
  const { user, isPending } = UseGetUserProfile();

  const { isCopied: usernameIsCopied, copy: usernameCopy } = useCopy(
    user?.username,
  );
  const { isCopied: phoneIsCopied, copy: phoneCopy } = useCopy(user?.phone);

  const { userId } = useParams<{ userId: string }>();

  if (isPending) return <ContactProfileSkeleton />;

  if (!user) notFound();

  const userInitials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-950">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
        {/* Gradient Header */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {/* افکت‌های نوری هدر */}
          <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-purple-300/20 blur-3xl" />
        </div>

        <CardContent className="relative px-6 pb-7 pt-0">
          {/* Avatar & Name */}
          <div className="-mt-16 flex flex-col items-center">
            <Avatar className="h-32 w-32 border-[5px] border-white shadow-xl transition-colors duration-300 dark:border-slate-900">
              <AvatarImage
                src={user?.avatar}
                alt={user.name || "کاربر"}
                className="object-cover"
              />

              <AvatarFallback className="bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {user.name}
              </h1>

              {user.username && (
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  @{user.username}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center transition-colors duration-300 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                “{user.bio}”
              </p>
            </div>
          ) : null}

          <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />

          {/* Contact Information */}
          <div className="space-y-3">
            {/* Phone */}
            {user.phone && (
              <button
                type="button"
                onClick={() => phoneCopy()}
                className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3 text-left transition-all hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 transition-colors duration-300 group-hover:bg-blue-200/70 dark:bg-blue-500/15 dark:text-blue-400 dark:group-hover:bg-blue-500/25">
                    <Phone className="size-4.5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Phone Number
                    </p>

                    <p
                      className="mt-0.5 text-left text-sm font-semibold text-slate-900 dark:text-white"
                      dir="ltr"
                    >
                      {user.phone}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs transition-colors ${
                    phoneIsCopied
                      ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {phoneIsCopied ? "Copied" : "Copy"}
                </Badge>
              </button>
            )}

            {/* Username */}
            {user.username && (
              <button
                type="button"
                onClick={() => usernameCopy()}
                className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3 text-left transition-all hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600 transition-colors duration-300 group-hover:bg-orange-200/70 dark:bg-orange-500/15 dark:text-orange-400 dark:group-hover:bg-orange-500/25">
                    <User className="size-4.5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Username
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs transition-colors ${
                    usernameIsCopied
                      ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {usernameIsCopied ? "Copied" : "Copy"}
                </Badge>
              </button>
            )}
          </div>

          <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />

          {/* Chat Action */}
          <Button
            asChild
            className="h-11 w-full gap-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Link href={`/messages/${userId}`}>
              <MessageCircle className="size-4.5" />
              Chat
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default ContactProfileCard;
