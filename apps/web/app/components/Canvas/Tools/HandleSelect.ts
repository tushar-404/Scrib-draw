import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { Action, ArrowAction, TextAction } from "../store";

interface HandleSelect {
  stage: Konva.Stage;
  actions: Action[];
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
  tool: string;
}


}

