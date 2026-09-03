"use client";

import { useState } from "react";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PVMessageType } from "@/types/PVMessage";
import { Edit3, Loader2, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { HubConnection } from "@microsoft/signalr";

type PropsType = {
  message: PVMessageType;
  signal: HubConnection | null;
};

const EditBtn = ({ message, signal }: PropsType) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(message.text || "");
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useParams();

  const isChanged =
    text.trim() !== (message.text || "") && text.trim().length > 0;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setText(message.text || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged || isLoading || !signal) return;

    try {
      setIsLoading(true);
      // ارسال متن جدید به جای متن قدیمی (message.text)
      await signal.send("EditPVMessage", message.id, text.trim(), userId);
      setOpen(false);
    } catch (err) {
      console.error("Failed to edit message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          handleOpenChange(true);
        }}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/80 focus:bg-zinc-800 focus:text-white"
      >
        <Edit3 className="size-4 text-amber-400" />
        <span>ویرایش پیام</span>
      </ContextMenuItem>

      {/* دیالوگ ویرایش */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-2xl border-zinc-800/80 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-[460px]">
          <DialogHeader className="space-y-2 text-right">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <Edit3 className="size-4 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-zinc-100">
                  ویرایش پیام
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  متن پیام را ویرایش کرده و ذخیره نمایید.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-3 space-y-4">
            <div className="relative rounded-xl bg-zinc-900/70 p-1.5 ring-1 ring-zinc-800/80 transition-all focus-within:ring-2 focus-within:ring-amber-500/40">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="متن پیام..."
                dir="auto"
                rows={4}
                autoFocus
                className="resize-none border-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="flex items-center justify-between px-2 pb-1 pt-1 text-[11px] text-zinc-500">
                <span>{text.length} کاراکتر</span>
                {isChanged && (
                  <span className="flex items-center gap-1 font-medium text-amber-400">
                    <Sparkles className="size-3" /> تغییر یافته
                  </span>
                )}
              </div>
            </div>

            <DialogFooter className="flex-row-reverse gap-2 pt-1 sm:justify-start">
              <Button
                type="submit"
                disabled={!isChanged || isLoading}
                className="h-9 cursor-pointer rounded-xl bg-amber-500 px-4 text-xs font-medium text-zinc-950 transition-all hover:bg-amber-400 disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "ذخیره تغییرات"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="h-9 cursor-pointer rounded-xl border border-zinc-800/80 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              >
                انصراف
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBtn;
