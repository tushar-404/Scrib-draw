import { useAtom, useAtomValue } from "jotai";
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
import HandleSquare from "./Tools/HandleSquare";
import HandleEraser from "./Tools/HandleEraser";

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
  FillAtom,
  FillboolAtom,
  actionsSnapshotAtom,
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
  const [fill] = useAtom(FillAtom);
  const fillEnabled = useAtomValue(FillboolAtom);
  const [actionSnapshot, setActionSnapshot] = useAtom(actionsSnapshotAtom);
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
      cleanup = HandleText(
        stageRef.current,
        stableSetActions,
        colors.hex,
        width,
      );
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
    } else if (tool === "square") {
      cleanup = HandleSquare(
        stageRef.current,
        stableSetActions,
        colors.hex,
        width,
        fill.hex,
        fillEnabled,
      );
    } else if (tool === "select") {
      cleanup = HandleSelect({
        stage: stageRef.current,
        selectedIds,
        setSelectedIds,
      });
    } else if (tool === "eraser") {
      cleanup = HandleEraser({ stage: stageRef.current });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [
    tool,
    stableSetActions,
    colors.hex,
    width,
    selectedIds,
    setSelectedIds,
    fill,
    fillEnabled,
  ]);

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
      style={{
        width: "100vw",
        height: "100vh",
        cursor:
          tool === "draw"
            ? "crosshair"
            : tool === "pan"
              ? "grab"
              : tool === "eraser"
                ? `url('data:image/svg+xml;utf8,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">
                  <rect x="5" y="5" width="23" height="15" fill="white" stroke="black" stroke-width="1.5" rx="7" ry="4" transform="rotate(-45 30 20)"/>
                </svg>`,
                  )}') 30 20, auto`
                : "default",
      }}
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

            if (action.tool === "draw" || action.tool === "straightline") {
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
                  hitStrokeWidth={isSelected ? 100 : 10}
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
                  hitStrokeWidth={isSelected ? 100 : 10}
                />
              );
            }

            if (action.tool === "square") {
              return (
                <Rect
                  key={i}
                  id={String(i)}
                  x={action.x}
                  y={action.y}
                  width={action.width}
                  height={action.height}
                  cornerRadius={10}
                  stroke={action.stroke}
                  strokeWidth={action.strokeWidth}
                  fill={action.fill || ""}
                  draggable={isSelected && tool === "select"}
                />
              );
            }

            if (action.tool === "text") {
              const textAction = action as TextAction;
              return textAction.textarea ? (
                <div key={i}>
                  {/* render DOM textarea from action */}
                  {document.body.appendChild(textAction.textarea)}
                </div>
              ) : (
                <Text
                  key={i}
                  id={String(i)}
                  x={textAction.x}
                  y={textAction.y}
                  text={textAction.text}
                  fontSize={textAction.fontSize}
                  fill={textAction.fill}
                  fontFamily="Arial"
                  hitStrokeWidth={isSelected ? 30 : 10}
                  draggable={isSelected && tool === "select"}
                />
              );
            }

            return null;
          })}

          {tool === "select" && (
            <Transformer
              ref={trRef}
              borderStroke="blue"
              borderDash={[6, 4]}
              borderStrokeWidth={1}
              anchorStroke="blue"
              anchorFill="white"
              anchorSize={6}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
