import { useBoardPosition } from "@/store/BoardPosition";
import { useRef, type RefObject } from "react"
import { useInterval, useMouse } from "react-use";
import {motion} from "motion/react"
import { socket } from "@/lib/Socket";


const MousePosition  = () => {
    const prevPosition = useRef<{x:number,y:number}>({x:0,y:0});

    const {x,y} = useBoardPosition();

 const ref =    useRef<HTMLDivElement>(null);

const {docX,docY} = useMouse(ref as RefObject<Element>);

useInterval(() => {
    if(prevPosition.current.x !== docX || prevPosition.current.y !== docY){
         socket.emit("mouse_move",docX-x.get(),docY - y.get());
         prevPosition.current = {x:docX , y:docY};
    }

},300)


return (
    <motion.div
    className="pointer-events-none absolute top-0 left-0 z-50 select-none"
    ref={ref}
    animate={{x:docX+15 , y:docY + 15}}
    transition={{duration:0.3,ease:"linear"}}
    >
      {docX-x.get()} | {docY - y.get()}
    </motion.div>
)

}

export default MousePosition;