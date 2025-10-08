import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import Konva from "konva";

export type Tool =
  | "select"
  | "pan"
  | "circle"
  | "square"
  | "arrow"
  | "straightline"
  | "draw"
  | "text"
  | "eraser"
  | "image";
export const toolAtom = atom<Tool>("draw");

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
  fill: string;
  opacity?: number;
}
export interface CircleAction {
  id: string;
  tool: "circle";
  x: number;
  y: number;
  radius: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  opacity: number;
}
export interface ImageAction {
  id: string;
  tool: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
}
export type Action =
  | DrawAction
  | TextAction
  | ArrowAction
  | StraightLineAction
  | SquareAction
  | CircleAction
  | ImageAction;
export const livePreviewAtom = atom<Action | null>(null);
export const actionsAtom = atomWithStorage<Action[]>("willshare", []);
export const selectedIdsAtom = atom<string[]>([]);

const historyAtom = atom<string[]>([JSON.stringify([])]);
export const historyStepAtom = atom(0);

export const historyControlsAtom = atom((get) => {
  const step = get(historyStepAtom);
  const history = get(historyAtom);
  return {
    canUndo: step > 0,
    canRedo: step < history.length - 1,
  };
});
export const recordActionAtom = atom(
  null,
  (get, set, updater: (prev: Action[]) => Action[]) => {
    const prevActions = get(actionsAtom);
    const newActions = updater(prevActions);
    const currentState = get(historyAtom)[get(historyStepAtom)];

    if (currentState === JSON.stringify(newActions)) {
      return;
    }

    const currentStep = get(historyStepAtom);
    let history = get(historyAtom);
    history = history.slice(0, currentStep + 1);
    history.push(JSON.stringify(newActions));
    set(historyAtom, history);
    set(historyStepAtom, history.length - 1);
    set(actionsAtom, newActions);

    const creationTools: Tool[] = [
      "text",
      "arrow",
      "straightline",
      "square",
      "circle",
      "image",
    ];
    const currentTool = get(toolAtom);

    if (
      newActions.length > prevActions.length &&
      creationTools.includes(currentTool)
    ) {
      const newAction = newActions[newActions.length - 1];

      if (newAction.id) {
        set(selectedIdsAtom, [newAction.id]);
      }

      set(toolAtom, "select");
    }
  },
);

export const undoAtom = atom(null, (get, set) => {
  if (get(historyControlsAtom).canUndo) {
    const newStep = get(historyStepAtom) - 1;
    set(historyStepAtom, newStep);
    const history = get(historyAtom);
    const prevState = JSON.parse(history[newStep] || "{}");
    set(actionsAtom, prevState);
  }
});

export const redoAtom = atom(null, (get, set) => {
  if (get(historyControlsAtom).canRedo) {
    const newStep = get(historyStepAtom) + 1;
    set(historyStepAtom, newStep);
    const history = get(historyAtom);
    const nextState = JSON.parse(history[newStep] || "{}");

    set(actionsAtom, nextState);
  }
});

export const resetAtom = atom(null, (get, set) => {
  set(actionsAtom, []);
  set(historyAtom, [JSON.stringify([])]);
  set(historyStepAtom, 0);
});

export const StageSizeAtom = atom({ width: 0, height: 0 });
export const StageAtom = atom<Konva.Stage | null>(null);

export type Width = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20;
export const WidthAtom = atom<Width>(2);

interface IColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
}

export const ColorAtom = atom<IColor>({
  hex: "#000000",
  rgb: { r: 0, g: 0, b: 0 },
  hsv: { h: 0, s: 0, v: 0 },
});

export const FillAtom = atom<IColor>({
  hex: "#ECC75F",
  rgb: { r: 236, g: 199, b: 95 },
  hsv: { h: 45, s: 60, v: 93 },
});

export const opacityatom = atom<number>(1);
export const FillboolAtom = atom<boolean>(false);
export const ShowSideBarAtom = atom<boolean>(false);
