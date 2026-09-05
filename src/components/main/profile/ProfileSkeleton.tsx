"use client";
import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-blue-500/20 selection:text-blue-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-zinc-900/40 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] animate-pulse">
          {/* Avatar Skeleton */}
          <div className="flex flex-col items-center text-center">
            <div className="size-24 rounded-full bg-zinc-800/70 border-2 border-white/5 mb-3" />
            {/* Username Pill Skeleton */}
            <div className="h-6 w-32 rounded-full bg-zinc-800/60 border border-white/5" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="mt-7 space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <div className="h-3 w-12 rounded bg-zinc-800/80 ml-1" />
              <div className="h-11 rounded-2xl bg-zinc-950/40 border border-white/5" />
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <div className="h-3 w-20 rounded bg-zinc-800/80" />
                <div className="h-4 w-14 rounded-md bg-zinc-800/40" />
              </div>
              <div className="h-11 rounded-2xl bg-zinc-950/30 border border-white/5" />
            </div>

            {/* Bio Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <div className="h-3 w-8 rounded bg-zinc-800/80" />
                <div className="h-3 w-10 rounded bg-zinc-800/50" />
              </div>
              <div className="h-24 rounded-2xl bg-zinc-950/40 border border-white/5" />
            </div>

            {/* Button Skeleton */}
            <div className="pt-2">
              <div className="h-11 w-full rounded-2xl bg-linear-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
