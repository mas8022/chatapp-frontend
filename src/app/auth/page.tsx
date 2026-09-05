"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import api from "@/utils/api";
import ResType from "@/types/response";

type FormDataType = {
  phone: string;
  otp: string;
};

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const phoneRegex = /^[0۰][9۹][0-9۰-۹]{9}$/;
  const otpRegex = /^\d{5}$/;

  const { register, handleSubmit, setValue, watch } = useForm<FormDataType>({
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (step !== "otp" || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const formatTime = (sec: number): string => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onSubmit = async (data: FormDataType) => {
    if (loading) return;
    setLoading(true);

    try {
      if (step === "phone") {
        if (!phoneRegex.test(data.phone)) {
          toast.error("Please enter a valid phone number");
          setLoading(false);
          return;
        }

        setPhone(data.phone);
        const response: ResType = await api.post("/auth/send-otp", {
          phone: data.phone,
        });

        if (response.status > 201) {
          setLoading(false);
          localStorage.setItem("accessToken", response.data.accessToken);
          return;
        }

        setStep("otp");
        setTimeLeft(120);
        setCanResend(false);
      } else {
        if (!otpRegex.test(data.otp)) {
          toast.error("Verification code must be 5 digits");
          setLoading(false);
          return;
        }

        const response: ResType = await api.post("/auth/verify-otp", {
          phone,
          code: data.otp,
        });

        if (response.status > 201) {
          setLoading(false);
          return;
        }

        window.location.href = "/";
      }
    } catch {
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    setLoading(true);

    try {
      const response: ResType = await api.post("/auth/send-otp", {
        phone,
      });

      if (response.status > 201) {
        return;
      }

      toast.success("Verification code resent successfully");
      setTimeLeft(120);
      setCanResend(false);
      setValue("otp", "");
    } catch {
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="ltr"
      className="relative flex min-h-screen items-center justify-center bg-zinc-50/70 p-4 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:bg-[#09090b] dark:selection:text-blue-400"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/10" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-600/10" />

      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white/90 p-7 shadow-[0_12px_45px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] sm:p-9">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/60 transition-all dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-950/30">
              {step === "phone" ? (
                <Smartphone className="h-7 w-7" strokeWidth={1.75} />
              ) : (
                <ShieldCheck className="h-7 w-7" strokeWidth={1.75} />
              )}
            </div>

            <h1 className="text-xl font-bold tracking-tight text-zinc-900 transition-colors dark:text-white sm:text-2xl">
              {step === "phone"
                ? "Sign in / Register"
                : "Enter Verification Code"}
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-zinc-500 transition-colors dark:text-zinc-400 sm:text-sm">
              {step === "phone"
                ? "Enter your phone number to receive a verification code"
                : `We sent a 5-digit code to ${phone}`}
            </p>

            {step === "otp" && (
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setValue("otp", "");
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit number</span>
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Phone Number
                  </label>

                  <div className="relative group/input">
                    <Smartphone className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within/input:text-blue-500 dark:text-zinc-500 dark:group-focus-within/input:text-blue-400" />
                    <Input
                      id="phone"
                      {...register("phone", { required: true })}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="09123456789"
                      disabled={loading}
                      autoFocus
                      className="h-12 rounded-2xl border-zinc-200 bg-zinc-50/70 pl-11 pr-4 font-mono text-base tracking-wider text-zinc-900 transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 focus:border-blue-500/70 focus:bg-white focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500/50 dark:focus:bg-zinc-950 dark:focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <PropagateLoader size={6} color="#ffffff" />
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-sm font-medium">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Shadcn OTP Input */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <InputOTP
                    maxLength={5}
                    value={otpValue}
                    onChange={(value: string) => setValue("otp", value)}
                    disabled={loading}
                    autoFocus
                  >
                    <InputOTPGroup className="gap-2 sm:gap-2.5">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-12 w-12 rounded-2xl border border-zinc-200 bg-zinc-50/70 font-mono text-lg font-semibold text-zinc-900 transition-all first:rounded-2xl last:rounded-2xl hover:border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:border-white/20 dark:focus:border-blue-500/50 dark:focus:ring-blue-500/20"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Timer & Resend Button */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-xs dark:border-zinc-800/80">
                  <span className="text-zinc-400 dark:text-zinc-500">
                    Didn&apos;t receive code?
                  </span>

                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Resend OTP</span>
                    </button>
                  ) : (
                    <span className="font-mono font-medium text-zinc-500 dark:text-zinc-400">
                      {formatTime(timeLeft)}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || otpValue?.length !== 5}
                  className="h-12 w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <PropagateLoader size={6} color="#ffffff" />
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-sm font-medium">
                      Verify & Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-400 transition-colors dark:text-zinc-500">
          By signing in, you agree to our{" "}
          <span className="cursor-pointer text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}
