import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, TextAction } from "../store";

const HandleText = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
  color: string,
  strokeWidth: number,
): (() => void) => {
  let isEditing = false;
  let currentTextNode: Konva.Text | null = null;
  let cursor: Konva.Line | null = null;
  let blinkingInterval: NodeJS.Timeout | null = null;

  const finalizeAndStopEditing = () => {
    if (!isEditing || !currentTextNode) return;

    const text = currentTextNode.text();

    if (text && text.trim().length > 0) {
      recordAction((prev) => [
        ...prev,
        {
          id: nanoid(),
          tool: "text",
          x: currentTextNode!.x(),
          y: currentTextNode!.y(),
          text: text,
          fill: color,
          fontSize: currentTextNode!.fontSize(),
        } as TextAction,
      ]);
    }

    if (blinkingInterval) clearInterval(blinkingInterval);
    blinkingInterval = null;
    cursor?.destroy();
    cursor = null;
    currentTextNode.destroy();
    currentTextNode = null;
    isEditing = false;
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isEditing) {
      finalizeAndStopEditing();
    }

    if (e.target !== stage) {
      return;
    }

    const pos = stage.getRelativePointerPosition();
    if (!pos) return;

    isEditing = true;
    const fontSize = strokeWidth * 5;
    const layer = stage.findOne("Layer");
    if (!layer) return;

    currentTextNode = new Konva.Text({
      x: pos.x,
      y: pos.y,
      text: "",
      fill: color,
      fontSize: fontSize,
      fontFamily: "Courier New",
    });
    layer.add(currentTextNode);

    cursor = new Konva.Line({
      points: [pos.x, pos.y, pos.x, pos.y + fontSize],
      stroke: color,
      strokeWidth: 1,
    });
    layer.add(cursor);

    blinkingInterval = setInterval(() => {
      cursor?.visible(!cursor.visible());
    }, 500);
  };

 
  const handleKeyDown = async (evt: KeyboardEvent) => {
    if (!isEditing || !currentTextNode) return;

    evt.preventDefault();

    if (evt.key === "Enter") {
      finalizeAndStopEditing();
      return;
    }

    if (evt.key === "Escape") {
      if (blinkingInterval) clearInterval(blinkingInterval);
      cursor?.destroy();
      currentTextNode.destroy();
      isEditing = false;
      return;
    }

    
    if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === "v") {
      try {
        const pastedText = await navigator.clipboard.readText();
        if (pastedText) {
          currentTextNode.text(currentTextNode.text() + pastedText);
        }
      } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
      }
    } else if (evt.key === "Backspace") {
      const currentText = currentTextNode.text();
      currentTextNode.text(currentText.slice(0, -1));
    } else if (evt.key.length === 1 && !evt.ctrlKey && !evt.metaKey) {
      currentTextNode.text(currentTextNode.text() + evt.key);
    }

   
    if (cursor) {
      const newX = currentTextNode.x() + currentTextNode.width();
      const newY = currentTextNode.y();
      cursor.points([newX, newY, newX, newY + currentTextNode.fontSize()]);

  
      cursor.visible(true);
      if (blinkingInterval) clearInterval(blinkingInterval);
      blinkingInterval = setInterval(() => {
        cursor?.visible(!cursor.visible());
      }, 500);
    }
  };

  stage.on("mousedown.text", handleMouseDown);
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    finalizeAndStopEditing();
    stage.off("mousedown.text");
    window.removeEventListener("keydown", handleKeyDown);
  };
};

export default HandleText;
