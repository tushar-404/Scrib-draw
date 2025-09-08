"use client";

import { useAtom } from "jotai";
import { Tool, toolAtom } from "./store";
import {
  Eraser,
  Pen,
  Hand,
  Diamond,
  Type,
  MoveRight,
  Minus,
  SquareDashedMousePointer,
  Undo2,
  Redo2,
} from "lucide-react";
//type Tool = 'select'||'pan' | 'diamond' | 'arrow' | 'straightline' |  'draw'| 'text'| 'eraser'

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const toolArray = [
    { icon: SquareDashedMousePointer, type: "select" },
    { icon: Hand, type: "pan" },
    { icon: Diamond, type: "diamond" },
    { icon: MoveRight, type: "arrow" },
    { icon: Minus, type: "straightline" },
    { icon: Pen, type: "draw" },
    { icon: Type, type: "text" },
    { icon: Eraser, type: "eraser" },
  ];

  function undo() {}
  function redo() {}

  return (
    <>
      <div className="flex w-max gap-1 items-center justify-center mx-auto mt-4 p-[2px] bg-white rounded-lg shadow">
        {toolArray.map(({ icon: Icon, type }) => (
          <div
            key={type}
            title={type} // <-- this shows the name on hover
            onClick={()=>(setTool(type as Tool))}
            className={`cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-[#000000] ${
              tool === type ? "bg-[#E0DFFF]" : "hover:bg-zinc-100 text-zinc-600"
            }`}
          >
            <Icon className="w-[7px] h-[7px]" />
          </div>
        ))}
      </div>
<div className="fixed bottom-4 mx-10 flex w-max gap-1 justify-center p-[2px] bg-white rounded-lg shadow">
    {[{ icon: Undo2, action: undo }, { icon: Redo2, action: redo }].map(({ icon: Icon, action }, i) => (
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
