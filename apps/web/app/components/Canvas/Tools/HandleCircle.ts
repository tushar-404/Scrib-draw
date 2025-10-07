import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, CircleAction } from "../store";

const HandleCircle = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  strokeWidth: number,
  fill: string,
  fillEnabled: boolean,
  opacityValue: number,
): (() => void) => {
  let isDrawing = false;
  let currentCircle: Konva.Circle | null = null;
  let startPos: { x: number; y: number } | null = null;

  const handleMouseDown = () => {
    isDrawing = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    startPos = pos;

    currentCircle = new Konva.Circle({
      x: startPos.x,
      y: startPos.y,
      radius: 0,
      stroke: color,
      strokeWidth: strokeWidth,
      fill: fillEnabled ? fill : "",
      opacity: opacityValue,
    });

    stage.findOne("Layer")?.add(currentCircle);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentCircle || !startPos) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const newX = (startPos.x + pos.x) / 2;
    const newY = (startPos.y + pos.y) / 2;

    const dx = pos.x - startPos.x;
    const dy = pos.y - startPos.y;
    const newRadius = Math.sqrt(dx * dx + dy * dy) / 2;

    currentCircle.setAttrs({
      x: newX,
      y: newY,
      radius: newRadius,
    });
  };

  const handleMouseUp = () => {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);

    if (!isDrawing || !currentCircle) return;
    isDrawing = false;

    const radius = currentCircle.radius();

    if (radius < 5) {
      currentCircle.destroy();
      currentCircle = null;
      return;
    }

    recordAction((prevActions) => [
      ...prevActions,
      {
        id: nanoid(),
        tool: "circle",
        x: currentCircle!.x(),
        y: currentCircle!.y(),
        radius: radius,
        stroke: color,
        strokeWidth: strokeWidth,
        fill: fillEnabled ? fill : "",
        opacity: opacityValue,
      } as CircleAction,
    ]);

    currentCircle.destroy();
    currentCircle = null;
  };

  stage.on("mousedown.circle touchstart.circle", handleMouseDown);
  stage.on("mousemove.circle touchmove.circle", handleMouseMove);

  return () => {
    stage.off(".circle");
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  };
};

export default HandleCircle;
