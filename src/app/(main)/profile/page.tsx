"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Check,
  Loader2,
  User,
  AtSign,
  FileText,
  Copy,
  Sparkles,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useGetMyProfile from "@/hooks/useGetMyProfile";
import useCopy from "@/hooks/useCopy";
import api from "@/utils/api";
import ProfileSkeleton from "@/components/main/profile/ProfileSkeleton";

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  bio: z
    .string()
    .max(120, { message: "Bio cannot exceed 120 characters" })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isPending } = useGetMyProfile();
  const { copy, isCopied } = useCopy(user?.username);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      bio: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!user) return;
    setValue("bio", user.bio || "");
    if (user.name) setValue("fullName", user.name);
    if (user.avatar) setAvatarPreview(user.avatar);
  }, [user, setValue]);

  const currentBio = watch("bio") || "";
  const currentFullName = watch("fullName") || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", data.fullName);
    if (data.bio) formData.append("bio", data.bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    await api.put("/users/edit-profile", formData);
  };

  if (isPending) return <ProfileSkeleton />;

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 text-zinc-900 
      antialiased selection:bg-blue-500/20 selection:text-blue-600 transition-colors duration-300
      dark:bg-[#09090b] dark:text-zinc-100 dark:selection:text-blue-300 sm:p-6"
    >
      {/* Glow Effect پشت کارت */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2
       rounded-full bg-blue-500/15 blur-[120px] dark:bg-blue-600/10"
      />

      <div className="relative w-full max-w-md">
        {/* Main Card Container */}
        <div
          className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white/75 p-6 shadow-2xl 
          shadow-slate-200/60 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/40 
          dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] sm:p-7"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            <div className="group relative mb-3">
              <Avatar className="size-24 rounded-full border-2 border-zinc-200/90 shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:border-blue-500/60 dark:border-white/10 dark:shadow-2xl dark:group-hover:border-blue-500/50">
                {avatarPreview && (
                  <AvatarImage
                    src={avatarPreview}
                    alt="Profile"
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 text-2xl font-bold uppercase tracking-wider text-white">
                  {currentFullName.trim().slice(0, 1) || "U"}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-[2px] transition-all duration-200 group-hover:opacity-100"
                title="Change Photo"
              >
                <Camera className="mb-0.5 size-5 text-zinc-100" />
                <span className="text-[10px] font-medium tracking-wide">
                  Edit
                </span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Username Copy Chip */}
            <button
              type="button"
              onClick={copy}
              className="group/btn inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100/80 px-3 py-1 text-xs text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-200/80 hover:text-zinc-900 active:scale-95 dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-200"
              title="Click to copy handle"
            >
              <AtSign className="size-3 text-zinc-400 transition-colors group-hover/btn:text-blue-500 dark:text-zinc-500 dark:group-hover/btn:text-blue-400" />
              <span className="font-mono">{user?.username}</span>
              <span className="mx-0.5 h-3 w-px bg-zinc-300 dark:bg-zinc-700/60" />
              {isCopied ? (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3 stroke-[2.5]" /> Copied
                </span>
              ) : (
                <Copy className="size-3 text-zinc-400 transition-colors group-hover/btn:text-zinc-700 dark:text-zinc-500 dark:group-hover/btn:text-zinc-300" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Name
              </label>
              <div className="group/input relative">
                <Input
                  {...register("fullName")}
                  placeholder="Your full name"
                  className={`h-11 rounded-2xl border bg-zinc-100/70 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-inner transition-all hover:border-zinc-300 dark:bg-zinc-950/50 dark:border-white/10 dark:hover:border-white/20 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${
                    errors.fullName
                      ? "border-rose-500/60 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                      : "border-zinc-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  }`}
                />
                <User
                  className={`absolute left-3.5 top-3.5 size-4 transition-colors ${
                    errors.fullName
                      ? "text-rose-500"
                      : "text-zinc-400 group-focus-within/input:text-blue-500 dark:text-zinc-500 dark:group-focus-within/input:text-blue-400"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="ml-1 mt-1 flex items-center gap-1 text-[11px] text-rose-500 animate-in fade-in-50 duration-200 dark:text-rose-400">
                  <AlertCircle className="size-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number (Read-only) */}
            <div className="space-y-1.5">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Phone Number
                </label>
                <span className="rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-400">
                  Read-only
                </span>
              </div>
              <div className="relative">
                <Input
                  value={user?.phone || ""}
                  readOnly
                  tabIndex={-1}
                  className="h-11 cursor-default select-all rounded-2xl border border-zinc-200/70 bg-zinc-100/50 pl-10 font-mono text-sm text-zinc-500 shadow-inner focus-visible:border-zinc-200/70 focus-visible:ring-0 dark:border-white/5 dark:bg-zinc-950/30 dark:text-zinc-400"
                />
                <Phone className="absolute left-3.5 top-3.5 size-4 text-zinc-400 dark:text-zinc-600" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Bio
                </label>
                <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                  {currentBio.length}/120
                </span>
              </div>
              <div className="group/input relative">
                <Textarea
                  {...register("bio")}
                  maxLength={120}
                  rows={3}
                  placeholder="A few words about yourself..."
                  className={`resize-none rounded-2xl border bg-zinc-100/70 pl-10 pt-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-inner transition-all hover:border-zinc-300 dark:bg-zinc-950/50 dark:border-white/10 dark:hover:border-white/20 dark:text-zinc-100 dark:placeholder:text-zinc-600 ${
                    errors.bio
                      ? "border-rose-500/60 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                      : "border-zinc-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  }`}
                />
                <FileText
                  className={`absolute left-3.5 top-3.5 size-4 transition-colors ${
                    errors.bio
                      ? "text-rose-500"
                      : "text-zinc-400 group-focus-within/input:text-blue-500 dark:text-zinc-500 dark:group-focus-within/input:text-blue-400"
                  }`}
                />
              </div>
              {errors.bio && (
                <p className="ml-1 mt-1 flex items-center gap-1 text-[11px] text-rose-500 animate-in fade-in-50 duration-200 dark:text-rose-400">
                  <AlertCircle className="size-3" />
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 opacity-90" /> Save Profile
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
