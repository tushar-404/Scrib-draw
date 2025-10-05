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
    !r1.x ||
    !r1.y ||
    !r1.width ||
    !r1.height ||
    !r2.x ||
    !r2.y ||
    !r2.width ||
    !r2.height
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
    strokeWidth: 0.2,
    visible: false,
  });
  selectionLayer.add(selectionRect);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;

    const target = e.target;

    if (target === stage) {
      isSelectingBox = true;
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      x1 = pos.x;
      y1 = pos.y;
      x2 = pos.x;
      y2 = pos.y;

      selectionRect.visible(true);
      selectionRect.width(0);
      selectionRect.height(0);
      return;
    }

    const shapeId = target.id(); // string
    if (!shapeId) return;

    const isShiftPressed = e.evt.shiftKey;
    const isAlreadySelected = selectedIds.includes(shapeId);

    if (!isShiftPressed) {
      if (!isAlreadySelected) setSelectedIds([shapeId]);
    } else {
      if (isAlreadySelected) {
        setSelectedIds((prev: string[]) => prev.filter((id) => id !== shapeId));
      } else {
        setSelectedIds((prev: string[]) => [...prev, shapeId]);
      }
    }
  };

  const handleMouseMove = () => {
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
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isSelectingBox) {
      isSelectingBox = false;
      selectionRect.visible(false);

      const mainLayer = stage.children[0];
      if (!mainLayer) return;

      const shapes = mainLayer.children;
      const box = selectionRect.getClientRect();
      const selectedInBox: string[] = [];

      shapes.forEach((shape) => {
        const shapeId = shape.id();
        if (!shapeId) return;
        const shapeBox = shape.getClientRect();
        if (haveIntersection(box, shapeBox)) selectedInBox.push(shapeId);
      });

      setSelectedIds(selectedInBox);
    }

    const pos = stage.getRelativePointerPosition();
    if (e.target === stage && pos && x1 === pos.x && y1 === pos.y) {
      setSelectedIds([]);
    }
  };

  stage.on("mousedown.select", handleMouseDown);
  stage.on("mousemove.select", handleMouseMove);
  stage.on("mouseup.select", handleMouseUp);

  return () => {
    stage.off("mousedown.select mousemove.select mouseup.select");
    selectionLayer.destroy();
  };
}
