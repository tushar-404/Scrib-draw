import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, ArrowAction } from "../store";
import { Layer } from "konva/lib/Layer";

const HandleArrow = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  strokeWidth: number,
): (() => void) => {
  let isDrawing = false;
  let currentArrow: Konva.Arrow | null = null;

  const handleMouseDown = () => {
    isDrawing = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    currentArrow = new Konva.Arrow({
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: color,
      strokeWidth: strokeWidth,
      lineCap: "round",
      lineJoin: "round",
      fill: color,
      pointerLength: strokeWidth * 4,
      pointerWidth: strokeWidth * 3,
    });

    (stage.findOne("Layer") as Layer)?.add(currentArrow);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentArrow) return;

    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const startPoints = currentArrow.points();
    const newPoints = [startPoints[0], startPoints[1], pos.x, pos.y];
    currentArrow.points(newPoints.filter((n): n is number => n !== undefined));

    currentArrow.getLayer()?.batchDraw();
  };

  const handleMouseUp = () => {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);

    if (!isDrawing || !currentArrow) return;
    isDrawing = false;

    const finalPoints = currentArrow.points();
    const [x1 = 0, y1 = 0, x2 = 0, y2 = 0] = finalPoints;
    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < strokeWidth * 4) {
      currentArrow.destroy();
      currentArrow = null;
      return;
    }

    recordAction((prevActions) => [
      ...prevActions,
      {
        id: nanoid(),
        tool: "arrow",
        points: finalPoints,
        stroke: color,
        strokeWidth: strokeWidth,
        fill: color,
        pointerLength: strokeWidth * 4,
        pointerWidth: strokeWidth * 3,
      } as ArrowAction,
    ]);

    currentArrow.destroy();
    currentArrow = null;
  };

  stage.on("mousedown.arrow touchstart.arrow", handleMouseDown);
  stage.on("mousemove.arrow touchmove.arrow", handleMouseMove);

  return () => {
    stage.off(".arrow");
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  };
};

export default HandleArrow;
