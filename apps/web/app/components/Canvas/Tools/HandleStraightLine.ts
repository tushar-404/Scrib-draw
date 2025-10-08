import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, StraightLineAction } from "../store";
import { Layer } from "konva/lib/Layer";

const HandleStraightLine = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  strokeWidth: number,
): (() => void) => {
  let isDrawing = false;
  let currentLine: Konva.Line | null = null;

  const handleMouseDown = () => {
    isDrawing = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    currentLine = new Konva.Line({
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: color,
      strokeWidth: strokeWidth,
      lineCap: "round",
      lineJoin: "round",
    });

    (stage.findOne("Layer") as Layer)?.add(currentLine);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentLine) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    const startPoints = currentLine.points() ?? [0, 0, 0, 0];
    const newPoints = [startPoints[0] ?? 0, startPoints[1] ?? 0, pos.x, pos.y];
    currentLine.points(newPoints);
    currentLine.getLayer()?.batchDraw();
  };

  const handleMouseUp = () => {
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);

    if (!isDrawing || !currentLine) return;
    isDrawing = false;

    const finalPoints = currentLine.points() as number[];
    const [x1 = 0, y1 = 0, x2 = 0, y2 = 0] = finalPoints;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < strokeWidth * 2) {
      currentLine.destroy();
      currentLine = null;
      return;
    }

    recordAction((prevActions) => [
      ...prevActions,
      {
        id: nanoid(),
        tool: "straightline",
        points: finalPoints,
        stroke: color,
        strokeWidth: strokeWidth,
      } as StraightLineAction,
    ]);

    currentLine.destroy();
    currentLine = null;
  };

  stage.on("mousedown.straightline touchstart.straightline", handleMouseDown);
  stage.on("mousemove.straightline touchmove.straightline", handleMouseMove);

  return () => {
    stage.off(".straightline");
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  };
};

export default HandleStraightLine;
