// HandleText.ts
import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, TextAction } from "../store";

export default function HandleText(
  stage: Konva.Stage,
  setActions: Dispatch<SetStateAction<Action[]>>,
) {
  const handleClick = () => {
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const newText: TextAction = {
      tool: "text",
      x: pos.x,
      y: pos.y,
      text: "New Text",
      fontSize: 20,
      fill: "black",
    };

    setActions((prev) => [...prev, newText]);
  };

  // attach click listener
  stage.on("click", handleClick);

  // cleanup
  return () => {
    stage.off("click", handleClick);
  };
}
