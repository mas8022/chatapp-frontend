"use client";

import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  SendHorizontal,
  Smile,
  X,
  Loader2,
  Mic,
  Trash2,
  Reply,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import axios from "axios";
import api from "@/utils/api";
import { PVMessageType } from "@/types/PVMessage";
import { HubConnection } from "@microsoft/signalr";

type MessageInputProps = {
  replyingTo: PVMessageType | null;
  onCancelReply: () => void;
    signal: HubConnection | null;
  
};

const MessageInput = ({
  replyingTo,
  onCancelReply,
  signal,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { userId } = useParams();
  // فوکوس اتوماتیک روی اینپوت بعد از کلیک روی Reply
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  // تایمر زمان ضبط ویس
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("دسترسی به میکروفون داده نشد.");
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    audioChunksRef.current = [];
  };

  const stopAndSendRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {
        type: "audio/webm",
      });

      await sendVoiceMessage(audioFile);
    };

    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFileToLiara = async (file: File): Promise<string> => {
    const { data } = await api.post("/media/presign", {
      fileName: file.name,
      contentType: file.type || "audio/webm",
    });

    await axios.put(data.uploadUrl, file, {
      headers: {
        "Content-Type": file.type || "audio/webm",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        }
      },
    });

    return data.fileUrl;
  };

  const sendVoiceMessage = async (voiceFile: File) => {
    try {
      setUploadProgress(0);
      const mediaUrl = await uploadFileToLiara(voiceFile);

      await signal?.send(
        "SendMessage",
        null,
        Number(userId),
        mediaUrl,
        replyingTo ? replyingTo.id : null,
      );

      setUploadProgress(null);
      onCancelReply();
    } catch (error) {
      setUploadProgress(null);
    }
  };

  const SendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    let mediaUrl: string | null = null;

    try {
      if (selectedFile) {
        setUploadProgress(0);
        mediaUrl = await uploadFileToLiara(selectedFile);
      }

      await signal?.send(
        "SendMessage",
        message.trim() || null,
        Number(userId),
        mediaUrl,
        replyingTo ? replyingTo.id : null,
      );

      setMessage("");
      setSelectedFile(null);
      setUploadProgress(null);
      onCancelReply();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setUploadProgress(null);
    }
  };

  const isUploading = uploadProgress !== null;
  const canSendText = Boolean(message.trim() || selectedFile);

  return (
    <div className="border-t border-white/10 bg-black/25 p-3 backdrop-blur-xl sm:p-4">
      {/* بنر ریپلای بالای اینپوت (مشابه تلگرام) */}
      {replyingTo && (
        <div className="mx-auto mb-2 flex max-w-4xl items-center justify-between gap-3 rounded-xl border-l-4 border-blue-500 bg-white/5 px-3 py-2 text-xs backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Reply className="size-4 text-blue-400 shrink-0 rotate-180" />
            <div className="flex flex-col truncate">
              <span className="font-semibold text-blue-400">پاسخ به پیام</span>
              <span className="truncate text-zinc-300">
                {replyingTo.text ||
                  (replyingTo.mediaUrl ? "📎 فایل ضمیمه" : "پیام")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* فایل انتخاب‌شده / پیش‌نمایش آپلود */}
      {selectedFile && (
        <div className="mx-auto mb-2 flex max-w-4xl items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
          <span className="truncate max-w-[70%]">{selectedFile.name}</span>
          <div className="flex items-center gap-2">
            {isUploading ? (
              <span className="flex items-center gap-1.5 text-blue-400 font-mono">
                <Loader2 className="size-3.5 animate-spin" />
                {uploadProgress}%
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="hover:text-red-400"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-4xl items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/10 sm:gap-2 sm:p-2">
        {/* حالت در حال ضبط ویس */}
        {isRecording ? (
          <div className="flex flex-1 items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-mono text-sm text-red-400 font-medium">
                {formatTimer(recordingDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={cancelRecording}
                className="size-8 rounded-full text-zinc-400 hover:bg-red-500/20 hover:text-red-400"
                title="لغو"
              >
                <Trash2 className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                onClick={stopAndSendRecording}
                className="size-8 rounded-full bg-blue-600 text-white hover:bg-blue-500"
                title="توقف و ارسال"
              >
                <SendHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* حالت ورودی متن عادی */
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*"
              className="hidden"
            />

            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="shrink-0 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label="Attach file"
            >
              <Paperclip className="size-5" />
            </Button>

            <Input
              ref={inputRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !isUploading) {
                  event.preventDefault();
                  SendMessage();
                }
              }}
              disabled={isUploading}
              placeholder={
                isUploading
                  ? `Uploading... ${uploadProgress}%`
                  : replyingTo
                    ? "پاسخ خود را بنویسید..."
                    : "Write a message..."
              }
              className="h-10 min-w-0 border-0 bg-transparent px-1 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0 sm:text-base"
            />

            <Button
              size="icon"
              variant="ghost"
              className="hidden shrink-0 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-white sm:inline-flex"
              aria-label="Emoji"
            >
              <Smile className="size-5" />
            </Button>

            {canSendText || isUploading ? (
              <Button
                onClick={SendMessage}
                disabled={isUploading}
                size="icon"
                className="z-10 shrink-0 rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                aria-label="Send message"
              >
                {isUploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <SendHorizontal className="size-5" />
                )}
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                size="icon"
                variant="ghost"
                className="shrink-0 rounded-xl text-zinc-400 hover:bg-white/10 hover:text-blue-400"
                aria-label="Record voice"
              >
                <Mic className="size-5" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
