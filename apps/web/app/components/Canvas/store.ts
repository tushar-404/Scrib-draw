import { atom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";

//types
type Tool = "pen" | "eraser";
type Line = {
  tool: Tool;
  points: number[];
};
export type KonvaMouseEvent=KonvaEventObject<MouseEvent>;
export const draggableAtom=atom<boolean>(false);
export const toolAtom = atom<Tool>("pen");
export const linesAtom = atom<Line[]>([]);
export const drawingAtom =atom<boolean>(false)
