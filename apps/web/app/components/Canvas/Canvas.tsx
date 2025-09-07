"use client";
import { Layer, Stage, Line } from "react-konva";
import Island from "./Island";
import { useAtom } from "jotai";
import { useRef } from "react";
import {
  draggableAtom,
  drawingAtom,
  KonvaMouseEvent,
  linesAtom,
  toolAtom,
} from "./store";
import HandleDraw from "./Tools/HandleDraw";

export default function StageComponent() {
  const [tool] = useAtom(toolAtom);
  const [lines, setLines] = useAtom(linesAtom);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const [Draggable] = useAtom(draggableAtom);
  const handleMouseDown = (e: KonvaMouseEvent) => {
    setDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };
  const handleMouseMove = (e: KonvaMouseEvent) => {
    if (!drawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };
  const handleMouseUp = () => {
    setDrawing(false);
  };
  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer
        >
          <HandleDraw/>
        </Layer>
      </Stage>
    </div>
  );
}
