// HandlePan.ts
import Konva from "konva";

export default function HandlePan(stage: Konva.Stage) {
  let isPanning = false;
  let lastPos = { x: 0, y: 0 };

  const handleMouseDown = () => {
    isPanning = true;
    lastPos = stage.getPointerPosition() || { x: 0, y: 0 };
  };

  const handleMouseMove = () => {
    if (!isPanning) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const dx = pos.x - lastPos.x;
    const dy = pos.y - lastPos.y;

    const layer = stage.getLayers()[0];
    if (!layer) return; // guard against undefined

    layer.x(layer.x() + dx);
    layer.y(layer.y() + dy);
    layer.batchDraw();

    lastPos = pos;
  };

  const handleMouseUp = () => {
    isPanning = false;
  };

  stage.on("mousedown", handleMouseDown);
  stage.on("mousemove", handleMouseMove);
  stage.on("mouseup", handleMouseUp);

  // cleanup
  return () => {
    stage.off("mousedown", handleMouseDown);
    stage.off("mousemove", handleMouseMove);
    stage.off("mouseup", handleMouseUp);
  };
}

