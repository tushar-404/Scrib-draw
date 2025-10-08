import { SetStateAction } from "jotai";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { Dispatch } from "react";

interface HandleSelectProps {
  stage: Stage;
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  selectedIds: string[];
}

function haveIntersection(r1: Konva.RectConfig, r2: Konva.RectConfig) {
  if (
    r1.x === undefined ||
    r1.y === undefined ||
    r1.width === undefined ||
    r1.height === undefined ||
    r2.x === undefined ||
    r2.y === undefined ||
    r2.width === undefined ||
    r2.height === undefined
  ) {
    return false;
  }
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export default function HandleSelect({
  stage,
  setSelectedIds,
  selectedIds,
}: HandleSelectProps) {
  let x1: number, y1: number, x2: number, y2: number;
  let isSelectingBox = false;

  const selectionLayer = new Konva.Layer();
  stage.add(selectionLayer);

  const selectionRect = new Konva.Rect({
    fill: "rgba(0, 0, 255, 0.2)",
    stroke: "#0000FF",
    strokeWidth: 0.5 / stage.scaleX(),
    visible: false,
  });
  selectionLayer.add(selectionRect);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isSelectingBox) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    x2 = pos.x;
    y2 = pos.y;

    selectionRect.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
    selectionLayer.batchDraw();
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    if (isSelectingBox) {
      isSelectingBox = false;
      selectionRect.visible(false);
      selectionLayer.batchDraw();

      const mainLayer = stage.findOne("Layer") as Konva.Layer | null;
      if (!mainLayer) return;

      const shapes = mainLayer.children;
      if (!shapes) return;
      const box = selectionRect.getClientRect();
      const selectedInBox: string[] = [];

      shapes.forEach((shape) => {
        const shapeId = shape.id();
        if (!shapeId) return;
        if (haveIntersection(box, shape.getClientRect())) {
          selectedInBox.push(shapeId);
        }
      });
      setSelectedIds(selectedInBox);
    }

    if (x1 === x2 && y1 === y2) {
      setSelectedIds([]);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;

    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    x1 = pos.x;
    y1 = pos.y;
    x2 = pos.x;
    y2 = pos.y;

    if (e.target === stage) {
      isSelectingBox = true;
      selectionRect.visible(true);
      selectionRect.width(0);
      selectionRect.height(0);
      selectionLayer.draw();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return;
    }

    const shapeId = e.target.id();
    if (!shapeId) return;

    const isShiftPressed = e.evt.shiftKey;
    const isAlreadySelected = selectedIds.includes(shapeId);

    if (!isShiftPressed) {
      if (!isAlreadySelected) setSelectedIds([shapeId]);
    } else {
      if (isAlreadySelected) {
        setSelectedIds((prev) => prev.filter((id) => id !== shapeId));
      } else {
        setSelectedIds((prev) => [...prev, shapeId]);
      }
    }
  };

  stage.on("mousedown.select", handleMouseDown);

  return () => {
    stage.off("mousedown.select");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    selectionLayer.destroy();
  };
}
