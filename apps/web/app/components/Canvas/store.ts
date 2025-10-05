import { atom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";

// -------------------- Tool Types --------------------
export type Tool =
  | "select"
  | "pan"
  | "square"
  | "arrow"
  | "straightline"
  | "draw"
  | "text"
  | "eraser";

export const toolAtom = atom<Tool>("draw");

// -------------------- Action Interfaces --------------------
export interface DrawAction {
  tool: Tool;
  points: number[];
  stroke: string;
  strokeWidth?: number;
  x?: number;
  y?: number;
}

export interface TextAction {
  tool: "text";
  x: number;
  y: number;
  text: string;
  fill: string;
  fontSize: number;
  textarea?: HTMLTextAreaElement; // optional, only for live input
}

export interface ArrowAction {
  tool: "arrow";
  stroke: string;
  points: [number, number, number, number];
  strokeWidth: number;
  x?: number;
  y?: number;
  pointerLength?: number;
  pointerWidth?: number;
  fill?: string;
}

export interface StraightLineAction {
  tool: "straightline";
  points: number[];
  stroke: string;
  strokeWidth: number;
  x?: number;
  y?: number;
}

export interface SquareAction {
  tool: "square";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: Width;
  fill?: string;
}

export type Action =
  | DrawAction
  | TextAction
  | ArrowAction
  | StraightLineAction
  | SquareAction;

// -------------------- Atoms --------------------
// Action & selection tracking
export const actionsAtom = atom<Action[]>([]);
export const selectedIdsAtom = atom<number[]>([]);

// Undo/redo history
export const historyAtom = atom<Action[][]>([]);
export const redoAtom = atom<Action[][]>([]);

// Stage size
export const StageSizeAtom = atom({ width: 0, height: 0 });

// -------------------- Konva Event Types --------------------
export type KonvaMouseEvent = KonvaEventObject<MouseEvent>;
export type KonvaWheelEvent = KonvaEventObject<WheelEvent>;

// -------------------- Stroke Width --------------------
export type Width = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20;
export const WidthAtom = atom<Width>(2);

// -------------------- Color --------------------
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

export const FillAtom = atom<IColor>({
  hex: "#561ecb",
  rgb: { r: 86, g: 30, b: 203 },
  hsv: { h: 263, s: 85, v: 80 },
});

export const FillboolAtom = atom<boolean>(false);

// -------------------- UI --------------------
export const ShowSideBarAtom = atom<boolean>(false);

