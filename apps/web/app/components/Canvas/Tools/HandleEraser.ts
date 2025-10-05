import Konva from "konva";
import { Stage } from "konva/lib/Stage";

interface HandleEraserProps {
  stage: Stage;
}

export default function HandleEraser({ stage }: HandleEraserProps) {
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return; 

    const target = e.target;

    
    if (target === stage) return;

   
    target.destroy();
    stage.batchDraw(); 
  };

  stage.on("mousedown.eraser", handleClick);

  return () => {
    stage.off("mousedown.eraser");
  };
}


