import Konva from "konva";
import type { KonvaTouchEvent } from "../store";

type Point = { x: number; y: number };

export default function HandlePan(stage: Konva.Stage) {
  Konva.hitOnDragEnabled = true;
  stage.draggable(true);

  let lastCenter: Point | null = null;
  let lastDist = 0;
  let dragStopped = false;

  function getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1: Point, p2: Point): Point {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  const handleTouchMove = (e: KonvaTouchEvent) => {
    e.evt.preventDefault();

    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (!touch1) return;

    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
      stage.startDrag();
      dragStopped = false;
    }

    if (touch1 && touch2) {
      if (stage.isDragging()) {
        dragStopped = true;
        stage.stopDrag();
      }

      const p1: Point = { x: touch1.clientX, y: touch1.clientY };
      const p2: Point = { x: touch2.clientX, y: touch2.clientY };

      if (!lastCenter) {
        lastCenter = getCenter(p1, p2);
        return;
      }

      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);

      if (!lastDist) lastDist = dist;

      const pointTo: Point = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      const scale = stage.scaleX() * (dist / lastDist);
      stage.scaleX(scale);
      stage.scaleY(scale);

      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos: Point = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      stage.position(newPos);

      lastDist = dist;
      lastCenter = newCenter;
    }
  };

  const handleTouchEnd = (_e: KonvaTouchEvent) => {
    lastDist = 0;
    lastCenter = null;
  };

  stage.on("touchmove", handleTouchMove);
  stage.on("touchend", handleTouchEnd);

  return () => {
    stage.off("touchmove", handleTouchMove);
    stage.off("touchend", handleTouchEnd);
    Konva.hitOnDragEnabled = false;
    stage.draggable(false);
    lastCenter = null;
    lastDist = 0;
  };
}

