"use client";

import React from "react";
import {
  Video,
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  VideoOff,
  PhoneIncoming,
  Radio,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVideoCall } from "@/hooks/useVideoCall";
import { HubConnection } from "@microsoft/signalr";

type PropsType = {
  targetUserId?: number;
  targetUserName?: string;
  signal: HubConnection | null;
};

export const VideoCallBtn = ({
  targetUserId,
  targetUserName = "کاربر",
  signal,
}: PropsType) => {
  const {
    callStatus,
    isMuted,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useVideoCall(targetUserId, signal);

  return (
    <Dialog open={callStatus !== "idle"}>
      <DialogTrigger>
        <Button
          variant="ghost"
          onClick={startCall}
          disabled={callStatus !== "idle"}
          title="تماس تصویری"
        >
          <Video className="size-5.1" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl w-full p-6 bg-zinc-950 text-white border-zinc-800"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader dir="rtl" className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-center gap-3">
            {/* آیکن وضعیت تماس */}
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                callStatus === "calling"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {callStatus === "calling" && (
                <Video className="size-5 animate-pulse" />
              )}

              {callStatus === "incoming" && (
                <PhoneIncoming className="size-5 animate-pulse" />
              )}

              {callStatus === "connected" && <Radio className="size-5" />}
            </div>

            {/* عنوان و وضعیت تماس */}
            <div className="min-w-0 text-right">
              <DialogTitle className="truncate text-base font-semibold text-white sm:text-lg">
                {callStatus === "calling" && `در حال تماس با ${targetUserName}`}

                {callStatus === "incoming" &&
                  `${targetUserName} با شما تماس گرفته است`}

                {callStatus === "connected" &&
                  `مکالمه تصویری با ${targetUserName}`}
              </DialogTitle>

              <div className="mt-1 flex items-center gap-2">
                {/* نشانگر متحرک وضعیت */}
                <span className="relative flex size-2 shrink-0">
                  {callStatus !== "connected" && (
                    <span
                      className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${
                        callStatus === "calling"
                          ? "bg-blue-400"
                          : "bg-emerald-400"
                      }`}
                    />
                  )}

                  <span
                    className={`relative inline-flex size-2 rounded-full ${
                      callStatus === "calling"
                        ? "bg-blue-400"
                        : "bg-emerald-400"
                    }`}
                  />
                </span>

                <p className="text-xs text-zinc-400">
                  {callStatus === "calling" && "منتظر پاسخ مخاطب بمانید"}
                  {callStatus === "incoming" && "تماس تصویری ورودی"}
                  {callStatus === "connected" &&
                    "تماس با موفقیت برقرار شده است"}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* محفظه ویدیوها (Picture-in-Picture) */}
        <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center my-4 border border-zinc-800">
          {/* ویدیوی طرف مقابل (تصویر بزرگ) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              callStatus !== "connected" ? "hidden" : "block"
            }`}
          />

          {/* حالت در حال انتظار/زنگ خوردن */}
          {callStatus !== "connected" && (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                <Video className="w-10 h-10 text-zinc-400" />
              </div>
              <p className="text-zinc-400 text-sm">
                {callStatus === "calling"
                  ? "در انتظار پاسخ..."
                  : "تماس ورودی..."}
              </p>
            </div>
          )}

          {/* ویدیوی خودمان (کادر کوچک PiP) */}
          <div
            className={`absolute top-4 right-4 w-36 aspect-video bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-lg ${
              callStatus === "idle" ? "hidden" : "block"
            }`}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted // برای اینکه صدای خودمان اکو نشود
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* دکمه‌های کنترلی تماس */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {/* حالت تماس ورودی */}
          {callStatus === "incoming" ? (
            <>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                className="rounded-full px-6 gap-2"
                onClick={endCall}
              >
                <PhoneOff className="w-5 h-5" />
                رد تماس
              </Button>
              <Button
                type="button"
                size="lg"
                className="rounded-full px-6 gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={acceptCall}
              >
                <PhoneCall className="w-5 h-5" />
                پاسخ
              </Button>
            </>
          ) : (
            /* حالت برقراری تماس یا مکالمه فعال */
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={`rounded-full w-12 h-12 ${
                  isMuted ? "bg-red-500/20 text-red-500 border-red-500" : ""
                }`}
                onClick={toggleMute}
                title={isMuted ? "فعال کردن میکروفون" : "قطع میکروفون"}
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className={`rounded-full w-12 h-12 ${
                  isVideoOff ? "bg-red-500/20 text-red-500 border-red-500" : ""
                }`}
                onClick={toggleVideo}
                title={isVideoOff ? "روشن کردن دوربین" : "خاموش کردن دوربین"}
              >
                {isVideoOff ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full w-12 h-12"
                onClick={endCall}
                title="قطع تماس"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
