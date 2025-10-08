"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  StageAtom,
  Tool,
  toolAtom,
  undoAtom,
  redoAtom,
  resetAtom,
  historyControlsAtom,
  actionsAtom,
} from "./store";
import {
  Eraser,
  Pen,
  Hand,
  Type,
  MoveRight,
  Minus,
  SquareDashedMousePointer,
  Square,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
  Circle,
  Image,
  Info,
  Github,
  Globe,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [stage, setStage] = useAtom(StageAtom);
  const resetCanvas = useSetAtom(resetAtom);
  const [, setAction] = useAtom(actionsAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const { canUndo, canRedo } = useAtomValue(historyControlsAtom);

  const [isInfoOpen, setInfoOpen] = useState(false);

  function handleReset() {
    setAction([]);
    resetCanvas();
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.shiftKey && e.key === "Z")) {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const toolArray = [
    { icon: SquareDashedMousePointer, type: "select" },
    { icon: Hand, type: "pan" },
    { icon: Square, type: "square" },
    { icon: Circle, type: "circle" },
    { icon: MoveRight, type: "arrow" },
    { icon: Minus, type: "straightline" },
    { icon: Pen, type: "draw" },
    { icon: Type, type: "text" },
    { icon: Image, type: "image" },
    { icon: Eraser, type: "eraser" },
  ];

  const handleRecenter = useCallback(() => {
    if (!stage) return;
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw();
    setStage(stage);
  }, [stage, setStage]);

  const baseButtonClass =
    "cursor-pointer flex items-center justify-center p-2 rounded-md border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600";
  const disabledButtonClass = "opacity-50 cursor-not-allowed";

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
            <Icon className="w-[10px] h-[12px]" strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Bottom-left controls */}
      <div className="fixed bottom-4 left-4 flex items-center gap-2 z-50 bg-white p-[2px] rounded-lg shadow border-[1px] border-transparent">
        <div
          onClick={canUndo ? undo : undefined}
          className={`${baseButtonClass} ${!canUndo && disabledButtonClass}`}
          title="Undo"
        >
          <Undo2 className="w-[10px] h-[10px]" />
        </div>
        <div
          onClick={canRedo ? redo : undefined}
          className={`${baseButtonClass} ${!canRedo && disabledButtonClass}`}
          title="Redo"
        >
          <Redo2 className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        <div
          onClick={handleRecenter}
          className={baseButtonClass}
          title="Recenter Canvas"
        >
          <RotateCcw className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        <div
          onClick={handleReset}
          title="Reset Canvas"
          className={baseButtonClass}
        >
          <Trash2 className="w-[10px] h-[10px]" />
        </div>
      </div>

      {/* Bottom-right info button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setInfoOpen(!isInfoOpen)}
          className="cursor-pointer flex items-center justify-center p-2 rounded-md border-[1px] border-transparent hover:bg-zinc-100 text-zinc-600 shadow bg-white"
          title="About this app"
        >
          <Info className="w-[12px] h-[12px]" />
        </button>

        <AnimatePresence>
          {isInfoOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-10 right-0 w-64 bg-white rounded-lg shadow border border-zinc-200 p-4 text-xs text-zinc-700 font-[var(--font-minefont)]"
            >
              <h4 className="font-semibold mb-2 text-sm">
                Collaborative Drawing
              </h4>
              <p className="mb-2 text-[10px]">
                Real-time collaborative drawing workspace
                <br />
                Share ideas, sketch, and work together.
                <br />
                <em className="text-zinc-400">
                  Live cursor sync coming soon...
                </em>
              </p>

              <p className="mb-2 flex items-center gap-2 text-[10px]">
                <Github className="w-3 h-3" />
                <a
                  href="https://github.com/dotbillu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
                <span className="text-black">·</span>
                <Globe className="w-3 h-3" />
                <a
                  href="https://dotbillu.github.io/Portfoliohtml/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
              </p>

              <p className="text-[9px] text-zinc-500">
                &copy; 2025 dotbillu — MIT License
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
