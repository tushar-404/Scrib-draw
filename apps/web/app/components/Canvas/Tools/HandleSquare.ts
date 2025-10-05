import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, SquareAction, Width } from "../store";
import { nanoid } from "nanoid";

export default function HandleSquare(
  stage: Konva.Stage,
  setActions: Dispatch<SetStateAction<Action[]>>,
  color: string,
  strokeWidth: Width,
  fill: string,
  fillenabled: boolean,
) {
  const isDrawing = { current: false };
  const startPos = { current: { x: 0, y: 0 } };

  const handleMouseDown = () => {
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    isDrawing.current = true;
    startPos.current = pos;

    const newSquare: SquareAction = {
      id: nanoid(),
      tool: "square",
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      stroke: color,
      strokeWidth: strokeWidth,
      fill: fillenabled ? fill : "",
    };

    setActions((prev: Action[]) => [...prev, newSquare]);
  };

  const handleMouseMove = () => {
    if (!isDrawing.current) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    setActions((prev: Action[]) => {
      const last = prev[prev.length - 1];
      if (last && last.tool === "square") {
        const updated: SquareAction = {
          ...last,
          x: Math.min(startPos.current.x, pos.x),
          y: Math.min(startPos.current.y, pos.y),
          width: Math.abs(pos.x - startPos.current.x),
          height: Math.abs(pos.y - startPos.current.y),
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
      if (last && last.tool === "square") {
        if (last.width < 5 || last.height < 5) {
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
