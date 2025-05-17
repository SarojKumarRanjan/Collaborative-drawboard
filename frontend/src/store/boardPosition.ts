import {create} from "zustand"
import { MotionValue,motionValue } from "motion/react"

interface RoomState {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export const useBoardPosition = create<RoomState>(() => ({
  x: motionValue(0),
  y: motionValue(0),
}));