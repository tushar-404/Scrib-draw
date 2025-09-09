import { atom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";

export type Tool = 'select' | 'pan' | 'diamond' | 'arrow' | 'straightline' | 'draw' | 'text' | 'eraser';
export const toolAtom = atom<Tool>("draw");

export interface DrawAction {
  tool: Tool;
  points: number[];
}
export interface TextAction {
  tool: "text";
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fill?: string;
}

export type Action = DrawAction| TextAction;

export const actionsAtom=atom<Action[]>([]);



export type KonvaMouseEvent = KonvaEventObject<MouseEvent>;





