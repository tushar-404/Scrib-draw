import { useAtom } from "jotai";
import { useEffect, useRef, useCallback, useState } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import HandleDraw from "./Tools/HandleDraw";
import {
  actionsAtom,
  TextAction,
  toolAtom,
  Action,
  StageSizeAtom,
} from "./store";
import Konva from "konva";
import { SetStateAction } from "jotai";
import HandleText from "./Tools/HandleText";
import HandlePan from "./Tools/HandlePan";

export default function StageComponent() {
  const [actions] = useAtom(actionsAtom);
  const [tool] = useAtom(toolAtom);
  const [, setActions] = useAtom(actionsAtom);
  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useAtom(StageSizeAtom);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setStageSize]);

  const stableSetActions = useCallback(
    (updater: SetStateAction<Action[]>) => {
      setActions(updater);
    },
    [setActions],
  );

  useEffect(() => {
    if (!stageRef.current) return;

    // always clean previous listeners first
    let cleanup: (() => void) | undefined;

    if (tool === "draw") {
      cleanup = HandleDraw(stageRef.current, stableSetActions);
    } else if (tool === "text") {
      cleanup = HandleText(stageRef.current, stableSetActions);
    } else if (tool === "pan") {
      cleanup = HandlePan(stageRef.current);
    }

    return () => {
      if (cleanup) cleanup(); // <- ensure last tool's listeners get removed
    };
  }, [tool, stableSetActions]);
  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
        <Layer>
          {actions.map((action, i) => {
            if (action.tool === "draw" || action.tool === "straightline") {
              return (
                <Line
                  key={i}
                  points={action.points}
                  stroke="black"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            }

            if (action.tool === "text") {
              const textAction = action as TextAction;
              return (
                <Text
                  key={i}
                  x={textAction.x}
                  y={textAction.y}
                  text={textAction.text}
                  fontSize={textAction.fontSize || 20}
                  fill={textAction.fill || "black"}
                />
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
