import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

// ----- Tool type -----
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

// ----- Action interfaces -----
export interface DrawAction {
  id?: string;
  tool: Tool;
  points: number[];
  stroke: string;
  strokeWidth?: number;
  x?: number;
  y?: number;
}

export interface TextAction {
  id?: string;
  tool: "text";
  x: number;
  y: number;
  text: string;
  fill: string;
  fontSize: number;
  textarea?: HTMLTextAreaElement;
}

export interface ArrowAction {
  id?: string;
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
  id?: string;
  tool: "straightline";
  points: number[];
  stroke: string;
  strokeWidth: number;
  x?: number;
  y?: number;
}

export interface SquareAction {
  id?: string;
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

export type ActionArray = Action[];

// ----- Atoms -----
export const selectedIdsAtom = atom<string[]>([]);
export const lastIndexAtom = atom<number | null>(null);

// Persisted atoms
export const actionsAtom = atom<Action[]>([]);
export const currentLayerAtom = atom<ActionArray[]>([]);
export const redoAtom = atom<ActionArray[]>([]);
export const finalLayerAtom=atomWithStorage<Action[]>("finalLayer",[]);

// Non-persisted atoms
export const StageSizeAtom = atom({ width: 0, height: 0 });

export type KonvaMouseEvent = KonvaEventObject<MouseEvent>;
export type KonvaWheelEvent = KonvaEventObject<WheelEvent>;
export const StageAtom=atom<Konva.Stage | null>(null)
// ----- Width ----- 
export type Width = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20;
export const WidthAtom = atom<Width>(2);

// ----- Color -----
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
export const ShowSideBarAtom = atom<boolean>(false);

