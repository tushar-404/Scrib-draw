"use client"
import { Layer, Line, Stage } from "react-konva";
import { drawingAtom, KonvaMouseEvent, linesAtom, toolAtom } from "../store";
import { useAtom } from "jotai";

export default function HandleEraser() {
  const [tool] = useAtom(toolAtom);
  const [drawing, setDrawing] = useAtom(drawingAtom);
  const [lines, setLines] = useAtom(linesAtom);
  const handleMouseDown = (e: KonvaMouseEvent) => {
    if (tool !== "eraser") return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    setDrawing(true);
    setLines([...lines, { tool: tool!, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaMouseEvent) => {
    if (tool !== "eraser") return;
    if (!drawing || lines.length === 0) return;
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const lastLine = lines[lines.length - 1]!;
    const updatedLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };

    setLines([...lines.slice(0, -1), updatedLine]);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
              strokeWidth={1}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}
