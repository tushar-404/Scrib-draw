import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, ArrowAction, Width } from "../store";
import { nanoid } from "nanoid";

export default function HandleArrow(
  stage: Konva.Stage,
  setActions: Dispatch<SetStateAction<Action[]>>,
  color: string,
  strokeWidth: Width,
) {
  const isDrawing = { current: false };
  const startPos = { current: { x: 0, y: 0 } };

  const handleMouseDown = () => {
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    isDrawing.current = true;
    startPos.current = pos;

    const newArrow: ArrowAction = {
      id: nanoid(),
      tool: "arrow",
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: color,
      strokeWidth: strokeWidth,
      pointerLength: strokeWidth * 4,
      pointerWidth: strokeWidth * 3,
      fill: color,
    };

    setActions((prev: Action[]) => [...prev, newArrow]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    setActions((prev: Action[]) => {
      const last = prev[prev.length - 1];
      if (last && last.tool === "arrow") {
        const arrowLast = last as ArrowAction;
        const updated: ArrowAction = {
          ...arrowLast,
          points: [startPos.current.x, startPos.current.y, pos.x, pos.y],
        };
        return [...prev.slice(0, -1), updated];
      }
      return prev;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    setActions((prev: Action[]) => {
      const last = prev[prev.length - 1];
      if (last && last.tool === "arrow") {
        const arrowLast = last as ArrowAction;
        const [x1, y1, x2, y2] = arrowLast.points;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length < strokeWidth * 4) {
          return prev.slice(0, -1);
        }
      }
      return prev;
    });
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
