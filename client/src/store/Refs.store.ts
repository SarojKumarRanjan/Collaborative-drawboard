import { createRef} from "react";
import { create } from "zustand";

interface Refstore {
  undoRef: React.RefObject<HTMLButtonElement | null>;
  redoRef: React.RefObject<HTMLButtonElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  bgRef: React.RefObject<HTMLCanvasElement | null>;
  smallCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectionRef: React.RefObject<HTMLButtonElement[] | null>;
  moveImage: {
    base64:string,
    x?:number,
    y?:number
  };
  setMoveImage: ({  base64, x, y }: { base64: string; x?: number; y?: number }) => void;
}

const useRefStore = create<Refstore>((set) => ({
  undoRef: createRef<HTMLButtonElement | null>(),
  redoRef: createRef<HTMLButtonElement | null>(),
  canvasRef: createRef<HTMLCanvasElement | null>(),
  bgRef: createRef<HTMLCanvasElement | null>(),
  selectionRef:createRef<HTMLButtonElement[] | null>(),
  smallCanvasRef: createRef<HTMLCanvasElement | null>(),
  moveImage: {
    base64: "",
    x: undefined,
    y: undefined
  },
  setMoveImage: ({ base64, x, y }) =>
    set(() => ({
      moveImage: {
        base64,
        x,
        y
      }
    }))
}));

export default useRefStore;
