import {create} from "zustand"
import { MotionValue,motionValue } from "motion/react"

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