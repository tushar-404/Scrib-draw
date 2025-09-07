"use client";

import { useAtom } from "jotai";
import { toolAtom } from "./store";
import { Eraser, Pen, Hand, Diamond, Type, MoveRight, Minus } from "lucide-react";
//type Tool = 'pan' | 'diamond' | 'arrow' | 'straightline' |  'draw'| 'Text'| 'eraser'

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const toolArray = [
  { icon: Hand, type: "draw" },
  { icon: Diamond, type: "diamond" },
  { icon: MoveRight, type: "arrow" },
  { icon: Minus, type: "straightline" },
  { icon: Pen, type: "pen" },
  { icon: Type, type: "text" },
  { icon: Eraser, type: "eraser" },
];
  return (
<div className="flex w-max gap-1 items-center justify-center mx-auto mt-4 p-[2px] bg-white rounded-lg shadow">
  {toolArray.map(({ icon: Icon, type }) => (
    <div
      key={type}
      title={type} // <-- this shows the name on hover
      onClick={() => setTool(type)}
      className={`cursor-pointer rounded-md p-2 border-[1px] border-transparent active:border-[#000000] ${
        tool === type
          ? "bg-[#E0DFFF]"
          : "hover:bg-zinc-100 text-zinc-600"
      }`}
    >
      <Icon className="w-[7px] h-[7px]" />
    </div>
  ))}
</div>
);
}
