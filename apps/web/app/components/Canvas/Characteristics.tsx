"use client";
import { useAtom } from "jotai";
import { ColorAtom, ShowSideBarAtom, Width, WidthAtom } from "./store";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function CharacteristicsIsland() {
  const [colors, setColors] = useAtom(ColorAtom);
  const [color, setColor] = useColor("#000000");
  const [showPallete, setShowPallete] = useAtom(ShowSideBarAtom);
  const [width, setWidth] = useAtom(WidthAtom);
  useEffect(() => {
    setColors(color);
  }, [color, setColors]);

  return (
    <div className="fixed m-4">
      <Palette
        color={colors.hex}
        onClick={() => setShowPallete(!showPallete)}
        className={`cursor-pointer shadow  border-transparent border-[1px]  rounded-lg bg-white`}
        onMouseDown={(e) => (e.currentTarget.style.borderColor = colors.hex)}
        onMouseUp={(e) => (e.currentTarget.style.borderColor = "transparent")}
      />
      {showPallete && (
        <div className="relative h-fit mt-2">
          {" "}
          <div>
            <ColorPicker color={color} onChange={setColor} height={100} />
          </div>
          <div className="absolute top-0 left-full bg-white shadow-lg inset-shadow-2xs ml-2 rounded-lg w-[60%] h-fit "
          onMouseDown={(e) => e.stopPropagation()}>
            <span className="ml-1 text-xs font-audiowide">Stroke Width</span>
            <br />
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={width}
              color={colors.hex}
              onChange={(e) => setWidth(Number(e.target.value) as Width)}
              className="w-[90%] h-1 ml-1 bg-gray-200 appearance-auto cursor-pointer "
              style={{ accentColor: colors.hex }}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}
