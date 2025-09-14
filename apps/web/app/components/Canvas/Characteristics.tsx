"use client";
import { useAtom } from "jotai";
import { ColorAtom } from "./store";
import { ColorPicker, useColor } from "react-color-palette";
import { useEffect } from "react";

export default function CharacteristicsIsland() {
  const [, setColors] = useAtom(ColorAtom);
  const [color, setColor] = useColor("rgb(86 30 203)");

  useEffect(() => {
    setColors(color);
  }, [color, setColors]);
  return (
    <>
      <ColorPicker color={color} onChange={setColor} />
    </>
  );
}
