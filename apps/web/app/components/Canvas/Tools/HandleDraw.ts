//handleDraw
import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, Width } from "../store";

export default function HandleDraw(
  stage: Konva.Stage,
  setActions: Dispatch<SetStateAction<Action[]>>,
  color: string,
  strokeWidth: Width,
) {
  const isDrawing = { current: false };
  const lastLinePoints = { current: [] as number[] };
  const handleMouseDown = () => {
    isDrawing.current = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    lastLinePoints.current = [pos.x, pos.y];

    setActions((prev: Action[]) => [
      ...prev,
      { tool: "draw", points: lastLinePoints.current, stroke: color,strokeWidth:strokeWidth },
    ]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    setActions((prev: Action[]) => {
      const last = prev[prev.length - 1];
      if (last && last.tool === "draw") {
        const updated = { ...last, points: [...last.points, pos.x, pos.y] };
        return [...prev.slice(0, -1), updated];
      }
      return prev;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  stage.on("mousedown", handleMouseDown);
  stage.on("mousemove", handleMouseMove);
  stage.on("mouseup", handleMouseUp);

  return () => {
    stage.off("mousedown", handleMouseDown);
    stage.off("mousemove", handleMouseMove);
    stage.off("mouseup", handleMouseUp);
  };
}
