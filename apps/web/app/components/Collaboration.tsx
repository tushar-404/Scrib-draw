"use client";

import { useAtom } from "jotai";
import { actionsAtom, EmptyAction } from "./Canvas/store";
import { useEffect, useRef, useState, useCallback } from "react";
import { Blend, Copy, Check, LogOut, Plus, LogIn, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CollaborationManager() {
  const [actions, setActions] = useAtom(actionsAtom);
  const [status, setStatus] = useState("Disconnected");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const isLocalChange = useRef(true);

  const connect = useCallback(
    (id: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      const ws = new WebSocket(`ws://localhost:8080?roomId=${id}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("Connected");
        setRoomId(id);
        setJoinModalOpen(false);
      };

      ws.onclose = () => {
        setStatus("Disconnected");
        setRoomId(null);
        wsRef.current = null;
        setUserCount(0);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setStatus("Error");
        setRoomId(null);
        wsRef.current = null;
      };

      ws.onmessage = (event) => {
        if (!event.data) return;
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.type === "userCount") {
            setUserCount(parsed.count);

            if (!parsed.ImNew) {
              const addEmptyAction = () => {
                const newEmptyAction: EmptyAction = {
                  id: nanoid(),
                  tool: "empty",
                };
                setActions((prev) => [...prev, newEmptyAction]);
              };
              addEmptyAction()
            }
          } else if (Array.isArray(parsed)) {
            isLocalChange.current = false;
            setActions(parsed);
          }
        } catch (err) {
          console.error("Failed to parse WS JSON:", err, event.data);
        }
      };
    },
    [setActions],
  );

  const disconnect = () => {
    if (wsRef.current) wsRef.current.close();
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!actions || actions.length === 0) return;

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    if (isLocalChange.current) {
      try {
        const payload = JSON.stringify(actions);
        ws.send(payload);
      } catch (err) {
        console.error("Failed to stringify or send actions:", err);
      }
    } else {
      isLocalChange.current = true;
    }
  }, [actions]);

  const handleCreateRoom = () => {
    const newRoomId = nanoid(8);
    setStatus("Connected");
    setRoomId(newRoomId);
    connect(newRoomId);
  };

  const handleCopyId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 ">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-md shadow-md flex items-center justify-center space-x-1 transition-colors duration-200 cursor-pointer ${
            status === "Connected"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
          aria-label="Collaboration Menu"
        >
          {status === "Connected" ? (
            <>
              <User size={18} />
              <span className="text-sm font-semibold">{userCount}</span>
            </>
          ) : (
            <Blend size={18} />
          )}
        </button>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow border border-gray-200 p-2"
            >
              {status === "Connected" && roomId ? (
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500 px-2 pt-1">
                    LIVE SESSION ({userCount}{" "}
                    {userCount === 1 ? "user" : "users"})
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-md">
                    <span className="text-sm font-mono text-gray-800 truncate">
                      {roomId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 text-gray-500 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                      aria-label="Copy Room ID"
                    >
                      {hasCopied ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={disconnect}
                    className="flex items-center w-full px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut size={14} className="mr-2" /> Leave Session
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={handleCreateRoom}
                    className="flex items-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Plus size={14} className="mr-2" /> Create Session
                  </button>
                  <button
                    onClick={() => {
                      setJoinModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  >
                    <LogIn size={14} className="mr-2" /> Join Session
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isJoinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setJoinModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const id = formData.get("roomId") as string;
                  if (id) connect(id.trim());
                }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Join a Session
                </h3>
                <input
                  type="text"
                  name="roomId"
                  placeholder="Enter Session ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                  autoFocus
                />
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => setJoinModalOpen(false)}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
