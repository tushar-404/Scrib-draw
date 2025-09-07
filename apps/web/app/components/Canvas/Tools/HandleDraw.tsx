"use client"
import { Layer, Line } from "react-konva";
import { draggableAtom, linesAtom, toolAtom } from "../store";
import { useAtom } from "jotai";

export default function HandleDraw() {
  const [tool] = useAtom(toolAtom);
    const [lines] = useAtom(linesAtom);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke="#000000"
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      ))}
    </>
  );
}
