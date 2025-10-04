import { useAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Line,
  Text,
  Arrow,
  Transformer,
  Rect,
} from "react-konva";

import HandleDraw from "./Tools/HandleDraw";
import HandleText from "./Tools/HandleText";
import HandleArrow from "./Tools/HandleArrow";
import HandleStraightLine from "./Tools/HandleStraightLine";
import HandleSelect from "./Tools/HandleSelect";

import {
  actionsAtom,
  TextAction,
  toolAtom,
  Action,
  StageSizeAtom,
  ColorAtom,
  WidthAtom,
  ShowSideBarAtom,
  ArrowAction,
  selectedIdsAtom,
} from "./store";

import Konva from "konva";
import { SetStateAction } from "jotai";

export default function StageComponent() {
  const [actions] = useAtom(actionsAtom);
  const [tool] = useAtom(toolAtom);
  const [, setActions] = useAtom(actionsAtom);
  const stageRef = useRef<Konva.Stage | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useAtom(StageSizeAtom);
  const [colors] = useAtom(ColorAtom);
  const [width] = useAtom(WidthAtom);
  const [, setShowSidebar] = useAtom(ShowSideBarAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);

 
  useEffect(() => {
    if (tool !== "select" || !trRef.current || !stageRef.current) {
      trRef.current?.nodes([]);
      return;
    }

    const nodes = selectedIds
      .map((id) => stageRef.current?.findOne("#" + id))
      .filter((node): node is Konva.Node => !!node);

    trRef.current.nodes(nodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, tool]);


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

    if (tool !== "select" && trRef.current) {
      trRef.current.nodes([]);
    }

    if (tool === "draw") {
      cleanup = HandleDraw(
        stageRef.current,
        stableSetActions,
        colors.hex,
        width,
      );
    } else if (tool === "text") {
      cleanup = HandleText(stageRef.current, stableSetActions);
    } else if (tool === "arrow") {
      cleanup = HandleArrow(
        stageRef.current,
        stableSetActions,
        colors.hex,
        width,
      );
    } else if (tool === "straightline") {
      cleanup = HandleStraightLine(
        stageRef.current,
        stableSetActions,
        colors.hex,
        width,
      );
    } else if (tool === "select") {
      cleanup = HandleSelect({
        stage: stageRef.current,
        selectedIds,
        setSelectedIds,
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [tool, stableSetActions, colors.hex, width, selectedIds, setSelectedIds]);

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
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
      className={
        tool === "draw"
          ? "cursor-crosshair"
          : tool === "pan"
            ? "cursor-grab"
            : ""
      }
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        ref={stageRef}
        onMouseDown={() => setShowSidebar(false)}
        draggable={tool === "pan"}
      >
        <Layer>
          {actions.map((action, i) => {
            const isSelected = selectedIds.includes(i);

      
            if (action.tool === "draw") {
              return (
                <Line
                  key={i}
                  id={String(i)}
                  points={action.points}
                  stroke={action.stroke}
                  strokeWidth={action.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  draggable={isSelected && tool === "select"}
                  hitStrokeWidth={isSelected ? 50 : 10} 
                />
              );
            }

       
            if (action.tool === "arrow") {
              const arrow = action as ArrowAction;
              return (
                <Arrow
                  key={i}
                  id={String(i)}
                  points={arrow.points}
                  stroke={arrow.stroke}
                  strokeWidth={arrow.strokeWidth}
                  pointerLength={arrow.pointerLength || 20}
                  pointerWidth={arrow.pointerWidth || 20}
                  fill={arrow.fill || arrow.stroke}
                  lineCap="round"
                  lineJoin="round"
                  draggable={isSelected && tool === "select"}
                  hitStrokeWidth={isSelected ? 50 : 10} 
                />
              );
            }

        
            if (action.tool === "text") {
              const textAction = action as TextAction;
              return (
                <>
                  {isSelected && (
                    <Rect
                      x={textAction.x}
                      y={textAction.y}
                      width={
                        textAction.text.length *
                        (textAction.fontSize || 20) *
                        0.6
                      }
                      height={textAction.fontSize || 20}
                      fill="rgba(0,0,0,0)" 
                      draggable
                    />
                  )}
                  <Text
                    key={i}
                    id={String(i)}
                    x={textAction.x}
                    y={textAction.y}
                    text={textAction.text}
                    fontSize={textAction.fontSize || 20}
                    fill={textAction.fill || "black"}
                    draggable={isSelected && tool === "select"}
                  />
                </>
              );
            }

            return null;
          })}

          {tool === "select" && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
