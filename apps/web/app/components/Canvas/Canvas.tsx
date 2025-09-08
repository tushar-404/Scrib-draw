"use client";
import HandleDraw from "./Tools/HandleDraw";
import HandlePan from "./Tools/HandlePan";
import HandleDiamond from "./Tools/HandleDiamond";
import HandleStraightLine from "./Tools/HandleStraightLine";
import HandleArrow from "./Tools/HandleArrow";
import HandleEraser from "./Tools/HandleEraser";
import HandleText from "./Tools/HandleText";
//type Tool = 'pan' | 'diamond' | 'arrow' | 'straightline' |  'draw'| 'text'| 'eraser'

export default function StageComponent() {

  return (
    <div>
      <HandlePan />
      <HandleDiamond />
      <HandleArrow />
      <HandleStraightLine />
      <HandleDraw />
      <HandleText />
      <HandleEraser />
    </div>
  );
}
