// hooks/useSignalR.ts
"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

type SignalRHandler = (...args: any[]) => void;

let sharedConnection: signalR.HubConnection | null = null;
let connectionPromise: Promise<signalR.HubConnection> | null = null;

export function useSignalR(listenerName?: string, handler?: SignalRHandler) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    sharedConnection,
  );

  const handlerRef = useRef<SignalRHandler | undefined>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL;

  useEffect(() => {
    if (!hubUrl) return;

    if (
      sharedConnection &&
      sharedConnection.state === signalR.HubConnectionState.Connected
    ) {
      setConnection(sharedConnection);
      return;
    }

    if (!connectionPromise) {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      connectionPromise = conn
        .start()
        .then(() => {
          sharedConnection = conn;
          setConnection(conn);
          return conn;
        })
        .catch((error) => {
          connectionPromise = null;
          throw error;
        });
    } else {
      connectionPromise.then((conn) => {
        setConnection(conn);
      });
    }
  }, [hubUrl]);

  useEffect(() => {
    if (!connection || !listenerName) return;

    const eventListener = (...args: unknown[]) => {
      handlerRef.current?.(...args);
    };

    connection.on(listenerName, eventListener);

    return () => {
      connection.off(listenerName, eventListener);
    };
  }, [connection, listenerName]);

  return { signal: connection };
}
