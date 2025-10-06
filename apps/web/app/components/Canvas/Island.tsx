"use client";

import { useAtom } from "jotai";
import {
  actionsAtom,
  currentLayerAtom,
  finalLayerAtom,
  redoAtom,
  StageAtom,
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
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect } from "react";

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [stage, setStage] = useAtom(StageAtom);

  const [, setRedoActions] = useAtom(redoAtom);
  const [, setCurrentLayer] = useAtom(currentLayerAtom);
  const [, setActions] = useAtom(actionsAtom);
  const [, setFinalLayer] = useAtom(finalLayerAtom);

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

  const resetCanvas = useCallback(() => {
    setFinalLayer([]);
    setActions([]);
    setCurrentLayer([]);
    setRedoActions([]);
  }, [setFinalLayer, setActions, setCurrentLayer, setRedoActions]);

  const handleRecenter = useCallback(() => {
    if (stage) {
      stage.position({ x: 0, y: 0 });
      stage.scale({ x: 1, y: 1 });
      stage.batchDraw();
      setStage(stage);
    }
  }, [stage, setStage]);

  // Ctrl+Z/Y key bindings
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

      {/* Bottom-left combined controls */}
      <div className="fixed bottom-4 left-4 flex items-center gap-2 z-50 bg-white p-[2px] rounded-lg shadow border-[1px] border-transparent">
        {/* Undo */}
        <div
          onClick={handleUndo}
          className="cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
          title="Undo"
        >
          <Undo2 className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        {/* Redo */}
        <div
          onClick={handleRedo}
          className="cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
          title="Redo"
        >
          <Redo2 className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        {/* Recenter */}
        <div
          onClick={handleRecenter}
          className="cursor-pointer flex items-center justify-center p-2 rounded-md border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
          title="Recenter Canvas"
        >
          <RotateCcw className="w-[10px] h-[10px]" />
        </div>

        <span className="border-l border-zinc-300 h-6"></span>

        {/* Reset */}
        <div
          onClick={resetCanvas}
          title="Reset Canvas"
          className="cursor-pointer flex items-center justify-center p-2 rounded-md border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
        >
          <Trash2 className="w-[10px] h-[10px]" />
        </div>
      </div>
    </>
  );
}

