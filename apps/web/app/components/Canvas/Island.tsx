// Island.tsx

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
} from "lucide-react";
import { useCallback, useEffect } from "react";

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [stage, setStage] = useAtom(StageAtom);

  // Get setters for our actions
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const resetCanvas = useSetAtom(resetAtom);

  // Get undo/redo availability state
  const { canUndo, canRedo } = useAtomValue(historyControlsAtom);

  // Keyboard shortcuts for undo/redo
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
        {/* Undo */}
        <div
          onClick={canUndo ? undo : undefined}
          className={`${baseButtonClass} ${!canUndo && disabledButtonClass}`}
          title="Undo"
        >
          <Undo2 className="w-[10px] h-[10px]" />
        </div>

        {/* Redo */}
        <div
          onClick={canRedo ? redo : undefined}
          className={`${baseButtonClass} ${!canRedo && disabledButtonClass}`}
          title="Redo"
        >
          <Redo2 className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>
        {/* Recenter */}
        <div
          onClick={handleRecenter}
          className={baseButtonClass}
          title="Recenter Canvas"
        >
          <RotateCcw className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        {/* Reset */}
        <div
          onClick={resetCanvas}
          title="Reset Canvas"
          className={baseButtonClass}
        >
          <Trash2 className="w-[10px] h-[10px]" />
        </div>
      </div>
    </>
  );
}
