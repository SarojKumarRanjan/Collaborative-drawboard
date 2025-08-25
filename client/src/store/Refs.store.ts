import { createRef } from "react";
import { create } from "zustand";

interface Refstore {
  undoRef: React.RefObject<HTMLButtonElement | null>;
  redoRef: React.RefObject<HTMLButtonElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  bgRef: React.RefObject<HTMLCanvasElement | null>;
  smallCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  moveImage: string;
  setMoveImage: (base64: string) => void;
}

const useRefStore = create<Refstore>((set) => ({
  undoRef: createRef<HTMLButtonElement | null>(),
  redoRef: createRef<HTMLButtonElement | null>(),
  canvasRef: createRef<HTMLCanvasElement | null>(),
  bgRef: createRef<HTMLCanvasElement | null>(),
  smallCanvasRef: createRef<HTMLCanvasElement | null>(),
  moveImage: "",
  setMoveImage: (base64) => set({ moveImage: base64 }),
}));

export default useRefStore;
