"use client";

import { useAtom } from "jotai";
import { Action, actionsAtom } from "./Canvas/store";
import { useEffect, useRef, useState } from "react";

export default function WSActionSender() {
  const [actions, setActions] = useAtom(actionsAtom);
  const [status, setStatus] = useState("Disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  const isLocalChange = useRef(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => setStatus("Connected");
    ws.onclose = () => setStatus("Disconnected");
    ws.onerror = () => setStatus("Error");

    ws.onmessage = (event) => {
      if (!event.data) return;

      try {
        const parsed = JSON.parse(event.data);
        if (Array.isArray(parsed)) {
          isLocalChange.current = false;
          setActions(parsed);
        } else {
          console.warn("WS message is not a valid action array:", parsed);
        }
      } catch (err) {
        console.error("Failed to parse WS JSON:", err, event.data);
      }
    };

    return () => ws.close();
  }, [setActions]);

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    if (isLocalChange.current) {
      try {
        const payload = JSON.stringify(actions);
        ws.send(payload);
      } catch (err) {
        console.error("Failed to send actions via WS:", err, actions);
      }
    } else {
      isLocalChange.current = true;
    }
  }, [actions]);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
      {status}
    </div>
  );
}
