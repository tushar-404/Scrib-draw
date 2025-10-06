"use client";
import { useAtom } from "jotai";
import {
  ColorAtom,
  FillAtom,
  WidthAtom,
  ShowSideBarAtom,
  opacityatom,
  FillboolAtom,
} from "./store";
import { Palette, Slash } from "lucide-react"; 

const STROKE_WIDTHS = [
  { value: 2, size: 3, label: "Fine" },
  { value: 5, size: 6, label: "Medium" },
  { value: 8, size: 9, label: "Bold" },
  { value: 12, size: 12, label: "Extra Bold" },
];

export default function CharacteristicsIsland() {
  const [colors, setColors] = useAtom(ColorAtom);
  const [fill, setFill] = useAtom(FillAtom);
  const [width, setWidth] = useAtom(WidthAtom);
  const [isSidebarVisible, setIsSidebarVisible] = useAtom(ShowSideBarAtom);
  const [opacity, setOpacity] = useAtom(opacityatom);
  const [fillenabled, setFillenabled] = useAtom(FillboolAtom);

  return (
    <div className="fixed left-4 top-4 z-50 flex flex-col items-start gap-2">
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-2 shadow-lg transition-all cursor-pointer"
        title="Toggle Properties"
      >
        <Palette color={colors.hex} size={20} />
      </button>

      {isSidebarVisible && (
        <div
          className="z-50 flex w-48 flex-col gap-3 rounded-lg bg-white p-3 font-sans shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* --- Stroke Properties --- */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Stroke
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-800">Color</label>
              <label
                htmlFor="stroke-color-picker"
                className="relative h-6 w-6 cursor-pointer rounded-md border border-gray-200"
                style={{ backgroundColor: colors.hex }}
              >
                <input
                  id="stroke-color-picker"
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={colors.hex}
                  onChange={(e) => setColors({ hex: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-800">Width</label>
              <div className="flex w-full items-center justify-between rounded-md bg-gray-100 p-0.5">
                {STROKE_WIDTHS.map(({ value, size, label }) => (
                  <button
                    key={value}
                    onClick={() => setWidth(value)}
                    className={`flex h-7 flex-1 items-center justify-center rounded ${
                      width === value
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                    title={label}
                  >
                    <div
                      className="rounded-full bg-gray-800"
                      style={{ height: `${size}px`, width: `${size}px` }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* --- Fill Properties --- */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Fill
            </h3>
            {/* Fill Color */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-800">Color</label>
              <div className="flex items-center gap-1.5">
                {/* --- NO FILL BUTTON --- */}
                <button
                  onClick={() => setFillenabled(false)}
                  title="No Fill"
                  className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                    !fillenabled
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 bg-transparent hover:bg-gray-100"
                  }`}
                >
                  <Slash
                    size={16}
                    className={`transition-colors ${
                      !fillenabled ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                </button>

                {/* --- COLOR PICKER SWATCH --- */}
                <label
                  htmlFor="fill-color-picker"
                  onClick={() => setFillenabled(true)}
                  className={`relative h-6 w-6 cursor-pointer rounded-md border-2 ${
                    fillenabled ? "border-blue-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: fill.hex }}
                >
                  <input
                    id="fill-color-picker"
                    type="color"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    value={fill.hex}
                    onChange={(e) => {
                      setFillenabled(true);
                      setFill({ hex: e.target.value });
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Opacity Slider */}
            <div>
              <div className="mt-1 flex items-center justify-between">
                <label
                  className={`text-xs transition-colors ${
                    !fillenabled ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Opacity
                </label>
                <span
                  className={`text-xs font-medium transition-colors ${
                    !fillenabled ? "text-gray-400" : "text-gray-500"
                  }`}
                ></span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                disabled={!fillenabled}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
