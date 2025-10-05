"use client";

import { useAtom } from "jotai";
import {
  actionsAtom,
  currentLayerAtom,
  redoAtom,
  Tool,
  toolAtom,
} from "./store";
import {
  Eraser,
  Pen,
  Hand,
  Type,
  MoveRight,
  Minus,
  SquareDashedMousePointer,
  Undo2,
  Redo2,
  Square,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef<number | null>(null);
  
  // Refs to track if the toast has been shown for the first time
  const hasShownUndoToast = useRef(false);
  const hasShownRedoToast = useRef(false);

  const toolArray = [
    { icon: SquareDashedMousePointer, type: "select" },
    { icon: Hand, type: "pan" },
    { icon: Square, type: "square" },
    { icon: MoveRight, type: "arrow" },
    { icon: Minus, type: "straightline" },
    { icon: Pen, type: "draw" },
    { icon: Type, type: "text" },
    { icon: Eraser, type: "eraser" },
  ];

  const [, setRedoActions] = useAtom(redoAtom);
  const [, setCurrentLayer] = useAtom(currentLayerAtom);
  const [, setActions] = useAtom(actionsAtom);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 1500);
  }, []);

  const handleUndo = useCallback(() => {
    setCurrentLayer((prev) => {
      const last = prev.at(-1);
      if (!last) return prev;
      setRedoActions((redoPrev) => [...redoPrev, last]);
      setActions(last);
      return prev.slice(0, -1);
    });
  }, [setCurrentLayer, setRedoActions, setActions]);

  const handleRedo = useCallback(() => {
    setRedoActions((prev) => {
      const last = prev.at(-1);
      if (!last) return prev;
      setCurrentLayer((current) => [...current, last]);
      setActions(last);
      return prev.slice(0, -1);
    });
  }, [setCurrentLayer, setRedoActions, setActions]);

  // Click handlers now check if the toast has been shown before
  const handleUndoClick = () => {
    if (!hasShownUndoToast.current) {
      showToast("use ctrl+z for fast undo");
      hasShownUndoToast.current = true;
    }
    handleUndo();
  };

  const handleRedoClick = () => {
    if (!hasShownRedoToast.current) {
      showToast("use ctrl+y for fast redo");
      hasShownRedoToast.current = true;
    }
    handleRedo();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "Z"))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const resetCanvas = () => {
    localStorage.removeItem("actions");
    localStorage.removeItem("currentLayer");
    localStorage.removeItem("redo");
    setActions([]);
    setCurrentLayer([]);
    setRedoActions([]);
    setShowConfirm(false);
  };

  return (
    <>
      {/* Tool selector */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex w-max gap-1 justify-center p-[2px] bg-white rounded-lg shadow">
        {toolArray.map(({ icon: Icon, type }) => (
          <div
            key={type}
            title={type}
            onClick={() => setTool(type as Tool)}
            className={`cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black ${
              tool === type ? "bg-[#E0DFFF]" : "hover:bg-zinc-100 text-zinc-600"
            }`}
          >
            <Icon className="w-[7px] h-[7px]" />
          </div>
        ))}
      </div>

      {/* Bottom-left controls */}
      <div className="fixed bottom-4 left-4 flex items-center gap-4">
        <div className="relative">
          {/* Toast Notification */}
          <div
            className={`absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 px-2.5 py-1 select-none bg-black/60 backdrop-blur-sm text-white text-xs rounded-md shadow-lg transition-opacity duration-300 ml-10 ${
              toastMessage ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {toastMessage}
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1 p-[2px] bg-white rounded-lg shadow">
            <div
              onClick={handleUndoClick}
              className="cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
            >
              <Undo2 className="w-[10px] h-[10px]" />
            </div>
            <div
              onClick={handleRedoClick}
              className="cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
            >
              <Redo2 className="w-[10px] h-[10px]" />
            </div>
          </div>
        </div>

        {/* Reset button */}
        <div
          onClick={() => setShowConfirm(true)}
          title="Reset Canvas"
          className="cursor-pointer flex items-center justify-center p-2 bg-white rounded-lg shadow border-[1px] border-transparent hover:bg-zinc-100 text-zinc-600 active:border-black"
        >
          <Trash2 className="w-[10px] h-[10px]" />
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-3 rounded-md shadow-md flex flex-col items-center gap-2 pointer-events-auto min-w-[180px]">
            <span className="text-sm text-gray-700 text-center">
              Reset canvas?
            </span>
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={resetCanvas}
                className="flex-1 px-2 py-1 bg-gray-100 text-gray-900 rounded-sm text-sm hover:bg-gray-200"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-2 py-1 bg-gray-100 text-gray-900 rounded-sm text-sm hover:bg-gray-200"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
