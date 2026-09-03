"use client";

import { useSignalR } from "@/hooks/useSignalR";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export type VideoCallStatus = "idle" | "calling" | "incoming" | "connected";

export function useVideoCall(
  targetUserId?: number,
  signal?: HubConnection | null,
) {
  const [callStatus, setCallStatus] = useState<VideoCallStatus>("idle");
  const [callerId, setCallerId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const incomingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // ساخت RTCPeerConnection
  const createPeerConnection = (targetId: number) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // دریافت استریم ویدیوی طرف مقابل
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ارسال کاندیدای شبکه به طرف مقابل
    pc.onicecandidate = (event) => {
      if (event.candidate && signal) {
        signal.invoke("SendVideoIceCandidate", targetId, event.candidate);
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // رویدادهای SignalR
  useEffect(() => {
    if (!signal) return;

    const handleIncomingCall = (data: {
      callerId: number;
      offer: RTCSessionDescriptionInit;
    }) => {
      setCallerId(data.callerId);
      incomingOfferRef.current = data.offer;
      setCallStatus("incoming");
    };

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

    const handleReceiveIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (e) {}
      }
    };

    const handleCallEnded = () => {
      cleanup();
    };

    signal.on("IncomingVideoCall", handleIncomingCall);
    signal.on("VideoCallAccepted", handleCallAccepted);
    signal.on("ReceiveVideoIceCandidate", handleReceiveIceCandidate);
    signal.on("VideoCallEnded", handleCallEnded);

    return () => {
      signal.off("IncomingVideoCall", handleIncomingCall);
      signal.off("VideoCallAccepted", handleCallAccepted);
      signal.off("ReceiveVideoIceCandidate", handleReceiveIceCandidate);
      signal.off("VideoCallEnded", handleCallEnded);
    };
  }, [signal]);

  // ۱. شروع تماس تصویری (تماس گیرنده)
  const startCall = async () => {
    if (!signal || !targetUserId) return;
    try {
      setCallStatus("calling");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeerConnection(targetUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await signal.invoke("CallUserVideo", targetUserId, offer);
    } catch (err) {
      cleanup();
    }
  };

  // ۲. پاسخ دادن به تماس (دریافت کننده)
  const acceptCall = async () => {
    if (!signal || !callerId || !incomingOfferRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeerConnection(callerId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingOfferRef.current),
      );
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await signal.invoke("AnswerVideoCall", callerId, answer);
      setCallStatus("connected");
    } catch (err) {
      cleanup();
    }
  };

  // ۳. قطع تماس
  const endCall = () => {
    const target = targetUserId || callerId;
    if (signal && target) {
      signal.invoke("HangUpVideo", target);
    }
    cleanup();
  };

  // ۴. ریست کردن وضعیت و بستن استریم‌ها
  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    incomingOfferRef.current = null;
    setIsMuted(false);
    setIsVideoOff(false);
    setCallStatus("idle");
    setCallerId(null);
  };

  // ۵. قطع و وصل میکروفون
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // ۶. قطع و وصل وبکم
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return {
    callStatus,
    callerId,
    isMuted,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
    startCall,
    acceptCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
