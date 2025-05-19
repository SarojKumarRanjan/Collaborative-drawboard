import type { MotionValue } from "motion/react"


export const getPosition = (pos:number,motionValue:MotionValue)=>{
    return pos + motionValue.get();
}