import {    useEffect, useRef, useState } from "react";
import { useBoardPosition } from "@/store/BoardPosition";
import { MotionValue, useMotionValue , motion} from "motion/react";
import { useViewportSize } from "@/hooks/Viewport";
import { CANVAS_SIZE } from "@/constant";
import useRefStore from "@/store/Refs.store";


type MiniMapProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  dragging: boolean;
  
};

const Minimap = ({  dragging }: MiniMapProps) => {

    const smallCanvasRef = useRefStore((state) => state.smallCanvasRef);
    const containerRef = useRef<HTMLDivElement>(null);
    const { height, width } = useViewportSize();
    
    const boardPosition = useBoardPosition();

    const [x,setX] = useState(0);
    const [y,setY] = useState(0);
    const [isDraggingMinimap, setIsDraggingMinimap] = useState(false);

    useEffect(() => {
      if(!isDraggingMinimap){
        const unsubscribe = boardPosition.x.onChange(setX);
        return unsubscribe;
      }

      return ()=>{}
    },[isDraggingMinimap,boardPosition.x]);

    useEffect(() => {
      if(!isDraggingMinimap){
        const unsubscribe = boardPosition.y.onChange(setY);
        return unsubscribe;
      }

      return ()=>{}
    },[isDraggingMinimap,boardPosition.y]);

    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    useEffect(() => {
      miniX.onChange((newX)=>{
        if(!dragging) {
          boardPosition.x.set(Math.floor(-newX * 10));
        }
      })

      miniY.onChange((newY)=>{
        if(!dragging) {
          boardPosition.y.set(Math.floor(-newY * 10));
        }
      })

    },[dragging,boardPosition.x,miniX,boardPosition.y,miniY]);


    return (
      <div
        className="absolute top-5 right-5 z-30 border border-zinc-500/80  rounded-xl bg-zinc-100 shadow-md"
        ref={containerRef}
        style={{
          width: CANVAS_SIZE.width / 10,
          height: CANVAS_SIZE.height / 10,
        }}
      >
        <canvas
          ref={smallCanvasRef}
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          className="h-full w-full"
        />

        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          onDragStart={() => setIsDraggingMinimap(true)}
          onDragEnd={() => {
            setIsDraggingMinimap(false);
          }}
          className="absolute top-0 left-0 cursor-grab border-2 rounded-xl border-blue-600 box active:cursor-grabbing"
          style={{
            width: width / 10,
            height: height / 10,
            x: miniX,
            y: miniY,
          }}
          animate={{ x:-x/10, y:-y/10 }}
          transition={{duration:0}}
        />
      </div>
    );
  }


Minimap.displayName = "Minimap";

export default Minimap;