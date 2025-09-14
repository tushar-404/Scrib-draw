"use client";

import { useAtom } from "jotai";
import { actionsAtom, redoAtom, Tool, toolAtom } from "./store";
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
} from "lucide-react";
//type Tool = 'select'||'pan' | 'diamond' | 'arrow' | 'straightline' |  'draw'| 'text'| 'eraser'

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [, setActions] = useAtom(actionsAtom);
  const toolArray = [
    { icon: SquareDashedMousePointer, type: "select" },
    { icon: Hand, type: "pan" },
    { icon: Square, type: "Square" },
    { icon: MoveRight, type: "arrow" },
    { icon: Minus, type: "straightline" },
    { icon: Pen, type: "draw" },
    { icon: Type, type: "text" },
    { icon: Eraser, type: "eraser" },
  ];
  const [, setRedoActions] = useAtom(redoAtom);

  function undo() {
    setActions((prev) => {
      const last = prev.at(-1);
      if (!last) return prev;

      setRedoActions((r) => [...r, last]);
      return prev.slice(0, -1);
    });
  }

  function redo() {
    setRedoActions((prev) => {
      const last = prev.at(-1);
      if (!last) return prev;

      setActions((a) => [...a, last]);
      return prev.slice(0, -1);
    });
  }
  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex w-max gap-1 justify-center p-[2px] bg-white rounded-lg shadow">
        {toolArray.map(({ icon: Icon, type }) => (
          <div
            key={type}
            title={type}
            onClick={() => setTool(type as Tool)}
            className={`cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-[#000000] ${
              tool === type ? "bg-[#E0DFFF]" : "hover:bg-zinc-100 text-zinc-600"
            }`}
          >
            <Icon className="w-[7px] h-[7px]" />
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 mx-10 flex w-max gap-1 justify-center p-[2px] bg-white rounded-lg shadow">
        {[
          { icon: Undo2, action: undo },
          { icon: Redo2, action: redo },
        ].map(({ icon: Icon, action }, i) => (
          <div
            key={i}
            onClick={action}
            className="cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-black hover:bg-zinc-100 text-zinc-600"
          >
            <Icon className="w-[10px] h-[10px]" />
          </div>
        ))}
      </div>
    </>
  );
}
