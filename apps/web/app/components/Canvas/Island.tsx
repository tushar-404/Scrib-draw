"use client";

import { useAtom } from "jotai";
import { draggableAtom, toolAtom } from "./store";

export default function Island() {
  const [tool, setTool] = useAtom(toolAtom);
  const [draggable,setDraggable]=useAtom(draggableAtom);
  return (
    <div className="fixed border h-10 w-[40%] bg-amber-50">
        <button onClick={() => setTool("eraser")}>eraser</button>
       <button onClick={() => setTool("pen")}>pen</button>
               <button onClick={() => setDraggable(!draggable)}>drag</button>

    </div>
  );
}
