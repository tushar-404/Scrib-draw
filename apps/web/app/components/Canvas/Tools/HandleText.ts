import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, TextAction } from "../store";
import { nanoid } from "nanoid";

export default function HandleText(
  stage: Konva.Stage,
  setActions: Dispatch<SetStateAction<Action[]>>,
  color: string,
  Stroke: number,
) {
  const isEditing = { current: false };
  let cursor: Konva.Line | null = null;
  let blinkingInterval: number | null = null;

  const stopEditing = () => {
    if (blinkingInterval) clearInterval(blinkingInterval);
    if (cursor) {
      cursor.destroy();
      cursor = null;
    }
    isEditing.current = false;
  };

  const handleMouseDown = () => {
    if (isEditing.current) {
      stopEditing();
    }

    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    const layer = stage.getLayers()[0];
    if (!layer) return;

    isEditing.current = true;
    const fontSize = Stroke * 5;

    cursor = new Konva.Line({
      points: [pos.x, pos.y, pos.x, pos.y + fontSize],
      stroke: color,
      strokeWidth: 1, // Thinner cursor width
      listening: false,
    });
    layer.add(cursor);

    blinkingInterval = setInterval(() => {
      cursor?.visible(!cursor.visible());
      layer.batchDraw();
    }, 500);

    const newText: TextAction = {
      id: nanoid(),
      tool: "text",
      x: pos.x,
      y: pos.y,
      text: "",
      fill: color,
      fontSize,
    };

    setActions((prev) => [...prev, newText]);
  };

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (!isEditing.current) return;

    const layer = stage.getLayers()[0];

    setActions((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.tool !== "text") return prev;

      let updatedText = (last as TextAction).text;

      if (evt.key === "Enter") {
        evt.preventDefault();
        stopEditing();
        return prev;
      } else if (evt.key === "Escape") {
        stopEditing();
        return prev.slice(0, -1);
      } else if (evt.key === "Backspace") {
        updatedText = updatedText.slice(0, -1);
      } else if (evt.key.length === 1 && !evt.ctrlKey && !evt.metaKey) {
        updatedText += evt.key;
      } else {
        return prev;
      }

      const tempText = new Konva.Text({
        text: updatedText,
        fontSize: (last as TextAction).fontSize,
      });
      const textWidth = tempText.width();

      if (cursor) {
        const newX = last.x + textWidth;
        const newY = last.y;
        cursor.points([newX, newY, newX, newY + last.fontSize]);
        cursor.visible(true);
        if (blinkingInterval) clearInterval(blinkingInterval);
        blinkingInterval = setInterval(() => {
          cursor?.visible(!cursor.visible());
        }, 500);
      }

      layer?.batchDraw();

      const updated: TextAction = {
        ...(last as TextAction),
        text: updatedText,
      };
      return [...prev.slice(0, -1), updated];
    });
  };

  stage.on("mousedown", handleMouseDown);
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    stopEditing();
    stage.off("mousedown", handleMouseDown);
    window.removeEventListener("keydown", handleKeyDown);
  };
}
