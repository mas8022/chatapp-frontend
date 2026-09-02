import { useParams } from "next/navigation";
import { useVoiceCall } from "@/hooks/useVoiceCall";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Phone,
  PhoneIncoming,
  PhoneOff,
  Mic,
  MicOff,
  User,
} from "lucide-react";
import useTimer from "@/hooks/useTimer";

type PropsType = {
  targetUserId?: number;
  targetUserName?: string;
};

const VoiceCallBtn = ({
  targetUserId,
  targetUserName = "کاربر",
}: PropsType) => {
  const {
    callStatus,
    callerId,
    isMuted,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
  } = useVoiceCall(targetUserId);

  const { callDuration } = useTimer(callStatus === "connected");

  const isDialogOpen = callStatus !== "idle";

  return (
    <Dialog open={isDialogOpen}>
      {/* استفاده از asChild برای جلوگیری از رندر دکمه تو در تو */}
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={startCall}
          className="hidden rounded-xl text-zinc-300 hover:bg-blue-500/15 hover:text-blue-400 sm:inline-flex"
          aria-label="Voice call"
        >
          <Phone className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        // جلوگیری از بسته شدن با کلیک بیرون از مدال
        onInteractOutside={(e) => e.preventDefault()}
        // جلوگیری از بسته شدن با کلید Escape
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xs border-white/10 bg-zinc-950/95 text-white backdrop-blur-2xl p-6 rounded-3xl shadow-2xl [&>button]:hidden select-none"
      >
        <DialogHeader className="items-center text-center space-y-4">
          {/* آواتار کاربر با انیمیشن وضعیت */}
          <div className="relative mt-2">
            {callStatus === "calling" && (
              <span className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping" />
            )}
            {callStatus === "incoming" && (
              <span className="absolute -inset-2 rounded-full bg-green-500/25 animate-ping" />
            )}
            <Avatar className="size-20 border-2 border-white/10 shadow-lg">
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xl font-bold">
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* عنوان و وضعیت تماس */}
          <div className="space-y-1">
            <DialogTitle className="text-base font-semibold tracking-tight text-zinc-100">
              {callStatus === "incoming"
                ? `${targetUserName}`
                : `${targetUserName}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              {callStatus === "calling" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                >
                  Calling...
                </Badge>
              )}
              {callStatus === "incoming" && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-400 border-green-500/20"
                >
                  Incoming Voice Call
                </Badge>
              )}
              {callStatus === "connected" && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono"
                >
                  {callDuration}
                </Badge>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* اکشن‌ها و دکمه‌های کنترلی تماس */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {callStatus === "incoming" ? (
            <>
              {/* دکمه قبول تماس */}
              <Button
                size="icon"
                onClick={acceptCall}
                className="size-12 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/40"
                aria-label="Accept call"
              >
                <PhoneIncoming className="size-5" />
              </Button>

              {/* دکمه رد تماس */}
              <Button
                size="icon"
                variant="destructive"
                onClick={endCall}
                className="size-12 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-950/40"
                aria-label="Decline call"
              >
                <PhoneOff className="size-5" />
              </Button>
            </>
          ) : (
            <>
              {/* دکمه Mute / Unmute در حین مکالمه */}
              {callStatus === "connected" && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleMute}
                  className={`size-12 rounded-full border-white/10 transition-colors ${
                    isMuted
                      ? "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/20"
                      : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label="Toggle mute"
                >
                  {isMuted ? (
                    <MicOff className="size-5" />
                  ) : (
                    <Mic className="size-5" />
                  )}
                </Button>
              )}

              {/* دکمه قطع تماس */}
              <Button
                size="icon"
                variant="destructive"
                onClick={endCall}
                className="size-12 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-950/40"
                aria-label="End call"
              >
                <PhoneOff className="size-5" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCallBtn;
