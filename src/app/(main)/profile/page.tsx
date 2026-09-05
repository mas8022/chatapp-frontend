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
import useGetProfile from "@/hooks/useGetProfile";
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

  const { user, isPending } = useGetProfile();
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
      className="relative min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 sm:p-6
     antialiased selection:bg-blue-500/20 selection:text-blue-300"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 h-85
       bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative w-full max-w-105">
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/8
         bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-3">
              <Avatar className="size-24 rounded-full border-2 border-white/10 shadow-2xl transition-all duration-300 group-hover:scale-[1.03] group-hover:border-blue-500/50">
                {avatarPreview && (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                )}
                <AvatarFallback className="bg-linear-to-tr from-blue-600 via-indigo-600 to-violet-500 text-white text-2xl font-bold uppercase tracking-wider">
                  {currentFullName.trim().slice(0, 1) || "U"}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-white"
                title="Change Photo"
              >
                <Camera className="size-5 mb-0.5 text-zinc-200" />
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

            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/50
               hover:bg-zinc-800/90 border border-white/6 hover:border-white/15 text-xs
                text-zinc-400 hover:text-zinc-200 transition-all active:scale-95 group/btn"
              title="Click to copy handle"
            >
              <AtSign className="size-3 text-zinc-500 group-hover/btn:text-blue-400 transition-colors" />
              <span className="font-mono">{user?.username}</span>
              <span className="w-px h-3 bg-zinc-700/60 mx-0.5" />
              {isCopied ? (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                  <Check className="size-3 stroke-[2.5]" /> Copied
                </span>
              ) : (
                <Copy className="size-3 text-zinc-500 group-hover/btn:text-zinc-300" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 ml-1">
                Name
              </label>
              <div className="relative group/input">
                <Input
                  {...register("fullName")}
                  placeholder="Your full name"
                  className={`h-11 rounded-2xl bg-zinc-950/50 border-white/6 hover:border-white/10 text-zinc-100 placeholder:text-zinc-600 pl-10 text-sm transition-all shadow-inner ${
                    errors.fullName
                      ? "border-rose-500/50 focus-visible:border-rose-500/80 focus-visible:ring-rose-500/20"
                      : "focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  }`}
                />
                <User
                  className={`size-4 absolute left-3.5 top-3.5 transition-colors ${
                    errors.fullName
                      ? "text-rose-400"
                      : "text-zinc-500 group-focus-within/input:text-blue-400"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 ml-1 mt-1 animate-in fade-in-50 duration-200">
                  <AlertCircle className="size-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Phone Number
                </label>
                <span className="text-[10px] text-zinc-500 font-medium bg-zinc-800/40 px-1.5 py-0.5 rounded-md border border-white/4">
                  Read-only
                </span>
              </div>
              <div className="relative">
                <Input
                  value={user?.phone || ""}
                  readOnly
                  tabIndex={-1}
                  className="h-11 rounded-2xl bg-zinc-950/30 border-white/4
                   text-zinc-400 font-mono pl-10 text-sm cursor-default select-all 
                   focus-visible:ring-0 focus-visible:border-white/4 shadow-inner"
                />
                <Phone className="size-4 text-zinc-600 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Bio
                </label>
                <span className="text-[10px] text-zinc-600 font-mono">
                  {currentBio.length}/120
                </span>
              </div>
              <div className="relative group/input">
                <Textarea
                  {...register("bio")}
                  maxLength={120}
                  rows={3}
                  placeholder="A few words about yourself..."
                  className={`rounded-2xl bg-zinc-950/50 border-white/6 hover:border-white/10 text-zinc-100 placeholder:text-zinc-600 pl-10 pt-3 text-sm resize-none transition-all shadow-inner ${
                    errors.bio
                      ? "border-rose-500/50 focus-visible:border-rose-500/80 focus-visible:ring-rose-500/20"
                      : "focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  }`}
                />
                <FileText
                  className={`size-4 absolute left-3.5 top-3.5 transition-colors ${
                    errors.bio
                      ? "text-rose-400"
                      : "text-zinc-500 group-focus-within/input:text-blue-400"
                  }`}
                />
              </div>
              {errors.bio && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 ml-1 mt-1 animate-in fade-in-50 duration-200">
                  <AlertCircle className="size-3" />
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-11 rounded-2xl font-medium text-sm transition-all duration-300
                   shadow-lg active:scale-[0.98] bg-linear-to-r from-blue-600 to-indigo-600
                   hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25`}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 opacity-80" /> Save Profile
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
