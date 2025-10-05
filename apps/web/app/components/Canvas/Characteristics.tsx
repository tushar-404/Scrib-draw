"use client";
import { useAtom } from "jotai";
import {
  ColorAtom,
  FillAtom,
  ShowSideBarAtom,
  WidthAtom,
  FillboolAtom,
} from "./store";
import { Palette } from "lucide-react";

export default function CharacteristicsIsland() {
  const [colors, setColors] = useAtom(ColorAtom);
  const [fill, setFill] = useAtom(FillAtom);
  const [width, setWidth] = useAtom(WidthAtom);
  const [showPalette, setShowPalette] = useAtom(ShowSideBarAtom);
  const [fillEnabled, setFillEnabled] = useAtom(FillboolAtom);

  return (
    <div className="fixed m-4 flex flex-col items-start space-y-2 font-minefont ">
      {/* Palette Icon */}
      <div className="flex items-center space-x-2">
        <Palette
          color={colors.hex}
          onClick={() => setShowPalette(!showPalette)}
          className="cursor-pointer shadow border border-transparent rounded-lg bg-white p-1"
        />
      </div>

      {/* Sidebar panel */}
      {showPalette && (
        <div
          className="bg-white shadow-lg rounded-lg p-4 w-44 z-50 flex flex-col space-y-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Stroke Color */}
          <div className="flex items-center justify-between space-x-2">
            <span className="text-xs">Stroke Color</span>
            <input
              type="color"
              value={colors.hex}
              onChange={(e) => setColors({ hex: e.target.value })}
              className="w-6 h-6 cursor-pointer border border-gray-300 p-0"
              style={{ padding: 0, borderRadius: "4px" }}
            />
          </div>
   {/* Fill Toggle */}
<div className="flex items-center justify-between space-x-2">
  <span className="text-xs">Enable Fill</span>
  <label className="relative inline-flex items-center cursor-pointer w-8 h-4">
    <input
      type="checkbox"
      checked={fillEnabled}
      onChange={() => setFillEnabled(!fillEnabled)}
      className="sr-only peer"
    />
    {/* Track */}
    <div
      className="w-8 h-4 rounded-full transition-all"
      style={{
        backgroundColor: fillEnabled ? fill.hex : "#e5e7eb", // gray when off, fill color when on
      }}
    ></div>
    {/* Knob */}
    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-all"></div>
  </label>
</div>

          {/* Fill Color */}
          <div className="flex items-center justify-between space-x-2">
            <span className="text-xs">Fill Color</span>
            <input
              type="color"
              value={fill.hex}
              onChange={(e) => setFill({ hex: e.target.value })}
              className="w-6 h-6 cursor-pointer border border-gray-300 p-0"
              style={{ padding: 0, borderRadius: "4px" }}
              disabled={!fillEnabled} // disable if toggle is off
            />
          </div>

          {/* Stroke Width */}
          <div className="flex flex-col">
            <label className="text-xs mb-1">Stroke Width</label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded cursor-pointer"
              style={{ accentColor: colors.hex }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
