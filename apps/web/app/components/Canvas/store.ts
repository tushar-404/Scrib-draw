import { atom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";

//types
export type Tool = 'select'| 'pan' | 'diamond' | 'arrow' | 'straightline' |  'draw'| 'text'| 'eraser' 
export type Line = {
  tool: Tool;
  points: number[];
};
export type KonvaMouseEvent=KonvaEventObject<MouseEvent>;
export const draggableAtom=atom<boolean>(false);
export const toolAtom = atom<Tool>("draw");

export const linesAtom = atom<Line[]>([]);

export const drawingAtom =atom(false)




