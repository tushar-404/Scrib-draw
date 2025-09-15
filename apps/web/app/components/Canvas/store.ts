import { atom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";

export type Tool =
  | "select"
  | "pan"
  | "diamond"
  | "arrow"
  | "straightline"
  | "draw"
  | "text"
  | "eraser";
export const toolAtom = atom<Tool>("draw");

export interface DrawAction {
  tool: Tool;
  points: number[];
  stroke: string;
  strokeWidth?: number;
}
export interface TextAction {
  tool: "text";
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fill?: string;
}
export type Action = DrawAction | TextAction;
export const actionsAtom = atom<Action[]>([]);
export const redoAtom = atom<Action[]>([]);

export const StageSizeAtom = atom({ width: 0, height: 0 });
export type KonvaMouseEvent = KonvaEventObject<MouseEvent>;
export type KonvaWheelEvent = KonvaEventObject<WheelEvent>;
export type KonvaTouchEvent = KonvaEventObject<TouchEvent>;




export type Width = 2 | 4 | 6 | 8 | 10 ;
export const WidthAtom = atom<Width>(2);

interface IColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
}

export const ColorAtom = atom<IColor>({
  hex: "#561ecb",
  rgb: { r: 86, g: 30, b: 203 },
  hsv: { h: 263, s: 85, v: 80 },
});
