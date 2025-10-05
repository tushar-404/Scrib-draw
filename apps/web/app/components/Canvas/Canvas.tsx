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
  Action,
  ArrowAction,
  TextAction,
  toolAtom,
  StageSizeAtom,
  ColorAtom,
  WidthAtom,
  ShowSideBarAtom,
  FillAtom,
  FillboolAtom,
  selectedIdsAtom,
  currentLayerAtom,
  finalLayerAtom,
} from "./store";

import Konva from "konva";
import { RotateCcw } from "lucide-react";

export default function StageComponent() {
  const [actions, setActions] = useAtom(actionsAtom);
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
  const fillEnabled = useAtomValue(FillboolAtom);
  const [currentLayer, setCurrentLayer] = useAtom(currentLayerAtom);

  // Update a specific action
  const updateAction = (idx: number, updates: Partial<Action>) => {
    setActions((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...updates } : a)),
    );
  };

  const stableSetActions = useCallback(
    (updater: Parameters<typeof setActions>[0]) => {
      setActions(updater);
    },
    [setActions],
  );

  // Keep transformer updated on selection
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

  // Resize stage dynamically
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

  // Tool handlers
  useEffect(() => {
    if (!stageRef.current) return;
    let cleanup: (() => void) | undefined;

    if (tool !== "select" && trRef.current) {
      trRef.current.nodes([]);
    }

    switch (tool) {
      case "draw":
        cleanup = HandleDraw(
          stageRef.current,
          stableSetActions,
          colors.hex,
          width,
        );
        break;
      case "text":
        cleanup = HandleText(
          stageRef.current,
          stableSetActions,
          colors.hex,
          width,
        );
        break;
      case "arrow":
        cleanup = HandleArrow(
          stageRef.current,
          stableSetActions,
          colors.hex,
          width,
        );
        break;
      case "straightline":
        cleanup = HandleStraightLine(
          stageRef.current,
          stableSetActions,
          colors.hex,
          width,
        );
        break;
      case "square":
        cleanup = HandleSquare(
          stageRef.current,
          stableSetActions,
          colors.hex,
          width,
          fill.hex,
          fillEnabled,
        );
        break;
      case "select":
        cleanup = HandleSelect({
          stage: stageRef.current,
          selectedIds,
          setSelectedIds,
        });
        break;
      case "eraser":
        cleanup = HandleEraser({ stage: stageRef.current });
        break;
    }

    return () => cleanup?.();
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

  // Keep current layer updated
  const [finalLayer, setFinalLayer] = useAtom(finalLayerAtom);
  useEffect(() => {
    setCurrentLayer((prev) => {
      let updatedLayer = [...prev];

      if (actions.length === 0) {
        // actions empty → push finalLayer if exists
        if (finalLayer.length > 0) {
          updatedLayer.push(finalLayer);
        }
      } else {
        // actions non-empty → push actions
        updatedLayer.push(actions);
        setFinalLayer(actions); // update finalLayer
      }

      // always set actions as the current finalLayer
      if (updatedLayer.length > 0) {
        setActions(updatedLayer[updatedLayer.length - 1]);
      }

      return updatedLayer;
    });
  }, [actions, setCurrentLayer, finalLayer, setFinalLayer, setActions]);

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
          tool === "draw"
            ? "crosshair"
            : tool === "pan"
              ? "grab"
              : tool === "eraser"
                ? `url('data:image/svg+xml;utf8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">
                <rect x="5" y="5" width="23" height="15" fill="white" stroke="black" stroke-width="1.5"
                  rx="7" ry="4" transform="rotate(-45 30 20)"/>
              </svg>
            `)}') 30 20, auto`
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
          {finalLayer.map((action, i) => {
            const isSelected = selectedIds.includes(action.id);

            switch (action.tool) {
              case "draw":
              case "straightline":
                return (
                  <Line
                    key={i}
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
                    id={action.id}
                    x={action.x}
                    y={action.y}
                    width={action.width}
                    height={action.height}
                    cornerRadius={10}
                    stroke={action.stroke}
                    strokeWidth={action.strokeWidth}
                    fill={action.fill || ""}
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
              case "text":
                const textAction = action as TextAction;
                return (
                  <Text
                    key={i}
                    id={action.id}
                    x={textAction.x}
                    y={textAction.y}
                    text={textAction.text}
                    fontSize={textAction.fontSize}
                    fill={textAction.fill}
                    fontFamily="Arial"
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
              anchorStroke="blue"
              anchorFill="white"
              anchorSize={6}
            />
          )}
        </Layer>
      </Stage>
      {/* Bottom-right Recenter Button */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 z-50">
        <div
          onClick={() => {
            if (stageRef.current) {
              stageRef.current.position({ x: 0, y: 0 });
              stageRef.current.scale({ x: 1, y: 1 });
              stageRef.current.batchDraw();
            }
          }}
          className="cursor-pointer flex items-center justify-center p-2 bg-white rounded-lg shadow border-[1px] border-transparent hover:bg-zinc-100 text-zinc-600 active:border-black"
          title="Recenter Canvas"
        >
          <RotateCcw className="w-[10px] h-[10px]" />
        </div>
      </div>
    </div>
  );
}
