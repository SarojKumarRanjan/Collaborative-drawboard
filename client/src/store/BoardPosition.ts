import { create } from "zustand";
import { MotionValue, motionValue } from "motion/react";

/*


this hook will be treated as room context provider
 everything related to room provider will be here




*/

interface RoomState {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export const useBoardPosition = create<RoomState>(() => ({
  x: motionValue(0),
  y: motionValue(0),
}));

interface BgState {
  mode: "light" | "dark";
  lines: boolean;
  setMode?: (mode: "light" | "dark") => void;
  setLines?: (lines: boolean) => void;
}

export const useBackgroundMode = create<BgState>((set) => ({
  mode: "light",
  lines: true,
  setMode: (mode) => {
    if (mode === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }

    return set({ mode });
  },
  setLines: (lines) => set({ lines }),
}));
