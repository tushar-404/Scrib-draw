import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { Action } from "../store"; 

interface HandleEraserProps {
  stage: Stage;
  recordAction: (updater: (prev: Action[]) => Action[]) => void;
}

export default function HandleEraser({ stage, recordAction }: HandleEraserProps) {
  let isErasing = false;

  const deletedIdsInSession = new Set<string>();
  const eraseTarget = (target: Konva.Node) => {

    if (target === stage) return;

    const id = target.id();

    if (id && !deletedIdsInSession.has(id)) {
      deletedIdsInSession.add(id);

      target.destroy();
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;
    isErasing = true;

    eraseTarget(e.target);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isErasing) return;

    eraseTarget(e.target);
  };

  const handleMouseUp = () => {
 
    isErasing = false;

    if (deletedIdsInSession.size > 0) {

      recordAction((prevActions) =>

        prevActions.filter((action) => !deletedIdsInSession.has(action.id!))
      );
    }

    deletedIdsInSession.clear();
  };

  stage.on("mousedown.eraser", handleMouseDown);
  stage.on("mousemove.eraser", handleMouseMove);


  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    stage.off("mousedown.eraser");
    stage.off("mousemove.eraser");
    window.removeEventListener("mouseup", handleMouseUp);
  };
}
