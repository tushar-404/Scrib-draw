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
    let cleanup: (() => void) | undefined;

    if (tool === "draw") {
      cleanup = HandleDraw(stageRef.current, stableSetActions);
    } else if (tool === "text") {
      cleanup = HandleText(stageRef.current, stableSetActions);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [tool, stableSetActions]);


const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
  if (!e.evt.ctrlKey) return;
  e.evt.preventDefault();

  const stage = stageRef.current;
  if (!stage) return;

  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();
  if (!pointer) return;

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const scaleBy = 1.08;
  const direction = e.evt.deltaY > 0 ? -1 : 1;
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
};
  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        ref={stageRef}
        draggable={tool === "pan"}
      >
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
