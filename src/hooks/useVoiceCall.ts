"use client";
import { useEffect, useRef, useState } from "react";
import { useSignalR } from "./useSignalR";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export type CallStatus = "idle" | "calling" | "incoming" | "connected";

export function useVoiceCall(targetUserId?: number) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callerId, setCallerId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const incomingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  const { signal } = useSignalR();

  // ایجاد عنصر صوتی مخفی برای پخش صدای طرف مقابل
  useEffect(() => {
    const audio = new Audio();
    audio.autoplay = true;
    remoteAudioRef.current = audio;

    return () => {
      audio.srcObject = null;
      audio.remove();
    };
  }, []);

  // آماده‌سازی PeerConnection
  const createPeerConnection = (targetId: number) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // دریافت استریم صدای طرف مقابل
    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    // ارسال آدرس‌های شبکه به طرف مقابل
    pc.onicecandidate = (event) => {
      if (event.candidate && signal) {
        signal.invoke("SendIceCandidate", targetId, event.candidate);
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // گوش دادن به ایونت‌های SignalR
  useEffect(() => {
    if (!signal) return;

    // وقتی تماسی دریافت می‌شود
    const handleIncomingCall = (data: {
      callerId: number;
      offer: RTCSessionDescriptionInit;
    }) => {
      setCallerId(data.callerId);
      incomingOfferRef.current = data.offer;
      setCallStatus("incoming");
    };

    // وقتی طرف مقابل تماس را پذیرفت
    const handleCallAccepted = async (data: {
      receiverId: number;
      answer: RTCSessionDescriptionInit;
    }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
        setCallStatus("connected");
      }
    };

    // وقتی کاندیدای ICE جدید آمد
    const handleReceiveIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (e) {
          console.error("Error adding ice candidate:", e);
        }
      }
    };

    // وقتی تماس توسط طرف دیگر قطع شد
    const handleCallEnded = () => {
      cleanup();
    };

    signal.on("IncomingCall", handleIncomingCall);
    signal.on("CallAccepted", handleCallAccepted);
    signal.on("ReceiveIceCandidate", handleReceiveIceCandidate);
    signal.on("CallEnded", handleCallEnded);

    return () => {
      signal.off("IncomingCall", handleIncomingCall);
      signal.off("CallAccepted", handleCallAccepted);
      signal.off("ReceiveIceCandidate", handleReceiveIceCandidate);
      signal.off("CallEnded", handleCallEnded);
    };
  }, [signal]);

  // ۱. شروع تماس
  const startCall = async () => {
    if (!signal || !targetUserId) return;
    try {
      setCallStatus("calling");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStreamRef.current = stream;

      const pc = createPeerConnection(targetUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await signal.invoke("CallUser", targetUserId, offer);
    } catch (err) {
      console.error(err);
      cleanup();
    }
  };

  // ۲. قبول تماس دریافتی
  const acceptCall = async () => {
    if (!signal || !callerId || !incomingOfferRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStreamRef.current = stream;

      const pc = createPeerConnection(callerId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingOfferRef.current),
      );
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await signal.invoke("AnswerCall", callerId, answer);
      setCallStatus("connected");
    } catch (err) {
      console.error(err);
      cleanup();
    }
  };

  // ۳. بستن و قطع تماس
  const endCall = () => {
    const target = targetUserId || callerId;
    if (signal && target) {
      signal.invoke("HangUp", target);
    }
    cleanup();
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    incomingOfferRef.current = null;
    setCallStatus("idle");
    setCallerId(null);
  };

  // میوت / آن‌میوت میکروفون خودمان
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return {
    callStatus,
    callerId,
    isMuted,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
  };
}
