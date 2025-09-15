"use client";
import { useAtom } from "jotai";
import { ColorAtom, Width, WidthAtom } from "./store";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function CharacteristicsIsland() {
  const [colors, setColors] = useAtom(ColorAtom);
  const [color, setColor] = useColor("#000000");
  const [showPallete, setShowPallete] = useState(false);
  const [width, setWidth] = useAtom(WidthAtom);
  useEffect(() => {
    setColors(color);
  }, [color, setColors]);

  return (
    <div className="fixed m-4 ">
      <Palette
        color={colors.hex}
        onClick={() => setShowPallete(!showPallete)}
        className={`cursor-pointer shadow  border-transparent border-[1px]  rounded-lg`}
        onMouseDown={(e) => (e.currentTarget.style.borderColor = colors.hex)}
        onMouseUp={(e) => (e.currentTarget.style.borderColor = "transparent")}
      />
      {showPallete ? (
        <div className="flex justify-between fixed">
          <div>
            <ColorPicker color={color} onChange={setColor} height={100} />
          </div>
          <div className=" bg-white shadow-md ml-2 self-start rounded-lg ">
            <span className="ml-1 font-audiowide">Stroke Width</span>
            <br />
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) as Width)}
              className="w-[80%] h-1 ml-1 bg-gray-200 appearance-auto cursor-pointer dark:bg-gray-700"
              style={{ accentColor: colors.hex }}
            />{" "}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
