"use client";

import { useState } from "react";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HubConnection } from "@microsoft/signalr";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";

type DeleteBtnProps = {
  signal: HubConnection | null;
  messageId: number | string;
};

const DeleteBtn = ({ signal, messageId }: DeleteBtnProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();

  const handleDelete = async () => {
    if (!signal || isLoading) return;
    setIsLoading(true);
    await signal.send("DeletePVMessage", messageId, userId);
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <>
      <ContextMenuSeparator className="my-1 bg-zinc-800/80" />

      {/* گزینه منوی کلیک راست */}
      <ContextMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10 focus:bg-rose-500/15 focus:text-rose-300"
      >
        <Trash2 className="size-4 text-rose-500" />
        <span>حذف پیام</span>
      </ContextMenuItem>

      {/* مودال دیالوگ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl border-zinc-800/80 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-[420px]">
          <DialogHeader className="space-y-3 text-right">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
                <AlertTriangle className="size-5 text-rose-500" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-zinc-100">
                  حذف پیام
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs text-zinc-400">
                  آیا از حذف این پیام اطمینان دارید؟ این عمل غیرقابل بازگشت است.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-4 flex-row-reverse gap-2 sm:justify-start">
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="h-9 cursor-pointer rounded-xl bg-rose-600 px-4 text-xs font-medium text-white transition-all hover:bg-rose-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "بله، حذف شود"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="h-9 cursor-pointer rounded-xl border border-zinc-800/80 bg-transparent text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            >
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBtn;
