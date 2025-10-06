import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { Action } from "../store";

const HandleDraw = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  width: number,
): (() => void) => {
  let isDrawing = false;
  let currentLine: Konva.Line | null = null;

  const handleMouseDown = () => {
    isDrawing = true;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    currentLine = new Konva.Line({
      stroke: color,
      strokeWidth: width,
      globalCompositeOperation: "source-over",
      lineCap: "round",
      lineJoin: "round",
      points: [pos.x, pos.y, pos.x, pos.y],
    });
    
    stage.findOne("Layer")?.add(currentLine);

  
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentLine) {
      return;
    }

    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    
    const newPoints = currentLine.points().concat([pos.x, pos.y]);
    currentLine.points(newPoints);
  };

  const handleMouseUp = () => {
 
    window.removeEventListener("mouseup", handleMouseUp);

    if (!isDrawing || !currentLine) {
      return;
    }
    isDrawing = false;

    const finalPoints = currentLine.points();

  
    if (finalPoints.length > 2) {
        recordAction((prevActions) => [
          ...prevActions,
          {
            id: uuidv4(),
            tool: "draw",
            points: finalPoints,
            stroke: color,
            strokeWidth: width,
          },
        ]);
    }
    
    currentLine.destroy();
    currentLine = null;
  };

  
  stage.on("mousedown.draw touchstart.draw", handleMouseDown);
  stage.on("mousemove.draw touchmove.draw", handleMouseMove);

  return () => {
    stage.off("mousedown.draw touchstart.draw");
    stage.off("mousemove.draw touchmove.draw");
   
    window.removeEventListener("mouseup", handleMouseUp);
  };
};

export default HandleDraw;
