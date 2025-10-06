import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, SquareAction } from "../store";

const HandleSquare = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  strokeWidth: number,
  fill: string,
  fillEnabled: boolean,
  opacityValue: number,
): (() => void) => {
  let isDrawing = false;
  let currentRect: Konva.Rect | null = null;
  let startPos: { x: number; y: number } | null = null;

  const handleMouseDown = () => {
    isDrawing = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    startPos = pos;

    currentRect = new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      stroke: color,
      strokeWidth: strokeWidth,
      fill: fillEnabled ? fill : "",
      cornerRadius: 10,
      opacity: opacityValue,
    });

    stage.findOne("Layer")?.add(currentRect);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentRect || !startPos) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const newX = Math.min(startPos.x, pos.x);
    const newY = Math.min(startPos.y, pos.y);
    const newWidth = Math.abs(pos.x - startPos.x);
    const newHeight = Math.abs(pos.y - startPos.y);

    currentRect.setAttrs({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
    
    if (!isDrawing || !currentRect) return;
    isDrawing = false;

    const width = currentRect.width();
    const height = currentRect.height();

    if (width < 5 && height < 5) {
      currentRect.destroy();
      currentRect = null;
      return;
    }

    recordAction((prevActions) => [
      ...prevActions,
      {
        id: nanoid(),
        tool: "square",
        x: currentRect.x(),
        y: currentRect.y(),
        width: width,
        height: height,
        stroke: color,
        strokeWidth: strokeWidth,
        fill: fillEnabled ? fill : "",
        opacity: opacityValue,
      } as SquareAction,
    ]);

    currentRect.destroy();
    currentRect = null;
  };

  stage.on("mousedown.square touchstart.square", handleMouseDown);
  stage.on("mousemove.square touchmove.square", handleMouseMove);

  return () => {
    stage.off(".square");
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  };
};

export default HandleSquare;
