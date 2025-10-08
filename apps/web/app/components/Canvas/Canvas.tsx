"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Line,
  Text,
  Arrow,
  Transformer,
  Rect,
  Circle,
  Image as KonvaImage,
} from "react-konva";
import Konva from "konva";
import useImage from "use-image";

// Tool Handlers
import HandleDraw from "./Tools/HandleDraw";
import HandleText from "./Tools/HandleText";
import HandleArrow from "./Tools/HandleArrow";
import HandleStraightLine from "./Tools/HandleStraightLine";
import HandleSelect from "./Tools/HandleSelect";
import HandleSquare from "./Tools/HandleSquare";
import HandleCircle from "./Tools/HandleCircle";
import HandleEraser from "./Tools/HandleEraser";
import HandleImage from "./Tools/HandleImage";

import {
  actionsAtom,
  Action,
  ArrowAction,
  CircleAction,
  ImageAction,
  TextAction,
  toolAtom,
  StageSizeAtom,
  ColorAtom,
  WidthAtom,
  ShowSideBarAtom,
  FillAtom,
  selectedIdsAtom,
  StageAtom,
  recordActionAtom,
  opacityatom,
  FillboolAtom,
} from "./store";

const URLImage = ({ shape, isSelected, onDragEnd, onTransformEnd }: any) => {
  const [img] = useImage(shape.src);
  return (
    <KonvaImage
      id={shape.id}
      image={img}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      draggable={isSelected}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
};

export default function StageComponent() {
  const [actions] = useAtom(actionsAtom);
  const [tool] = useAtom(toolAtom);
  const stageRef = useRef<Konva.Stage | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useAtom(StageSizeAtom);
  const [colors] = useAtom(ColorAtom);
  const [width] = useAtom(WidthAtom);
  const [, setShowSidebar] = useAtom(ShowSideBarAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  const [fill] = useAtom(FillAtom);
  const [, setStageAtom] = useAtom(StageAtom);
  const opacityy = useAtomValue(opacityatom);
  const recordAction = useSetAtom(recordActionAtom);
  const fillEnabled = useAtomValue(FillboolAtom);

  const updateAction = useCallback(
    (idx: number, updates: Partial<Action>) => {
      recordAction((prev) =>
        prev.map((a, i) => (i === idx ? { ...a, ...updates } : a)),
      );
    },
    [recordAction],
  );

  useEffect(() => {
    if (stageRef.current) setStageAtom(stageRef.current);
  }, [setStageAtom]);

  useEffect(() => {
    if (tool !== "select" || !trRef.current || !stageRef.current) {
      trRef.current?.nodes([]);
      return;
    }
    const nodes = selectedIds
      .map((id) => stageRef.current?.findOne("#" + id!))
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

  useEffect(() => {
    if (!stageRef.current) return;
    let cleanup: (() => void) | undefined;

    if (tool !== "select" && trRef.current) trRef.current.nodes([]);

    switch (tool) {
      case "draw":
        cleanup = HandleDraw(stageRef.current, recordAction, colors.hex, width);
        break;
      case "text":
        cleanup = HandleText(stageRef.current, recordAction, colors.hex, width);
        break;
      case "arrow":
        cleanup = HandleArrow(
          stageRef.current,
          recordAction,
          colors.hex,
          width,
        );
        break;
      case "straightline":
        cleanup = HandleStraightLine(
          stageRef.current,
          recordAction,
          colors.hex,
          width,
        );
        break;
      case "square":
        cleanup = HandleSquare(
          stageRef.current,
          recordAction,
          colors.hex,
          width,
          fill.hex,
          fillEnabled,
          opacityy,
        );
        break;
      case "circle":
        cleanup = HandleCircle(
          stageRef.current,
          recordAction,
          colors.hex,
          width,
          fill.hex,
          fillEnabled,
          opacityy,
        );
        break;

      case "image":
        cleanup = HandleImage(stageRef.current, recordAction);
        break;
      case "select":
        cleanup = HandleSelect({
          stage: stageRef.current,
          selectedIds,
          setSelectedIds,
        });
        break;
      case "eraser":
        cleanup = HandleEraser({ stage: stageRef.current, recordAction });
        break;
    }

    return () => cleanup?.();
  }, [
    tool,
    recordAction,
    colors.hex,
    width,
    selectedIds,
    setSelectedIds,
    fill,
    fillEnabled,
    opacityy,
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
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",

        cursor:
          tool === "image"
            ? "pointer"
            : tool === "draw"
              ? "crosshair"
              : tool === "pan"
                ? "grab"
                : tool === "eraser"
                  ? `url('data:image/svg+xml;utf8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40"><rect x="5" y="5" width="23" height="15" fill="white" stroke="black" stroke-width="1.5" rx="7" ry="4" transform="rotate(-45 30 20)"/></svg>`,
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
            const isSelected = selectedIds.includes(action.id!);
            switch (action.tool) {
              case "draw":
              case "straightline":
                return (
                  <Line
                    key={i}
                    {...action}
                    id={action.id}
                    points={action.points}
                    stroke={action.stroke}
                    strokeWidth={action.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    x={(action as any).x || 0}
                    y={(action as any).y || 0}
                    draggable={isSelected && tool === "select"}
                    hitStrokeWidth={isSelected ? 100 : 10}
                    onDragEnd={(e) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                  />
                );
              case "arrow":
                const arrow = action as ArrowAction;
                return (
                  <Arrow
                    key={i}
                    {...arrow}
                    id={action.id}
                    points={arrow.points}
                    stroke={arrow.stroke}
                    strokeWidth={arrow.strokeWidth}
                    pointerLength={arrow.pointerLength || 20}
                    pointerWidth={arrow.pointerWidth || 20}
                    fill={arrow.fill || arrow.stroke}
                    lineCap="round"
                    lineJoin="round"
                    x={(arrow as any).x || 0}
                    y={(arrow as any).y || 0}
                    draggable={isSelected && tool === "select"}
                    hitStrokeWidth={isSelected ? 100 : 10}
                    onDragEnd={(e) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                  />
                );
              case "square":
                return (
                  <Rect
                    key={i}
                    {...action}
                    id={action.id}
                    x={action.x}
                    y={action.y}
                    width={action.width}
                    height={action.height}
                    cornerRadius={10}
                    stroke={action.stroke}
                    strokeWidth={action.strokeWidth}
                    fill={action.fill}
                    opacity={action.opacity}
                    draggable={isSelected && tool === "select"}
                    onDragEnd={(e) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Rect;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      updateAction(i, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(1, node.width() * scaleX),
                        height: Math.max(1, node.height() * scaleY),
                      });
                    }}
                  />
                );
              case "circle":
                const circleAction = action as CircleAction;
                return (
                  <Circle
                    key={i}
                    {...circleAction}
                    id={circleAction.id}
                    x={circleAction.x}
                    y={circleAction.y}
                    radius={circleAction.radius}
                    stroke={circleAction.stroke}
                    strokeWidth={circleAction.strokeWidth}
                    fill={circleAction.fill}
                    opacity={circleAction.opacity}
                    draggable={isSelected && tool === "select"}
                    onDragEnd={(e) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Circle;
                      const scaleX = node.scaleX();
                      node.scaleX(1);
                      node.scaleY(1);
                      updateAction(i, {
                        x: node.x(),
                        y: node.y(),
                        radius: Math.max(1, node.radius() * scaleX),
                      });
                    }}
                  />
                );

            
              case "image":
                const imageAction = action as ImageAction;
                return (
                  <URLImage
                    key={i}
                    shape={imageAction}
                    isSelected={isSelected && tool === "select"}
                    onDragEnd={(e: any) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e: any) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      updateAction(i, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY),
                      });
                    }}
                  />
                );

              case "text":
                const textAction = action as TextAction;
                return (
                  <Text
                    key={i}
                    {...textAction}
                    id={action.id}
                    x={textAction.x}
                    y={textAction.y}
                    text={textAction.text}
                    fontSize={textAction.fontSize}
                    fill={textAction.fill}
                    fontFamily="Courier New"
                    hitStrokeWidth={isSelected ? 30 : 10}
                    draggable={isSelected && tool === "select"}
                    onDragEnd={(e) =>
                      updateAction(i, { x: e.target.x(), y: e.target.y() })
                    }
                  />
                );
              default:
                return null;
            }
          })}

          {tool === "select" && (
            <Transformer
              ref={trRef}
              borderStroke="blue"
              borderDash={[6, 4]}
              borderStrokeWidth={1}
              anchorStroke="#CBDFEC"
              anchorFill="white"
              anchorSize={6}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
