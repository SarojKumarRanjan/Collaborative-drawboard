import {    useEffect, useRef, useState } from "react";

import { MotionValue, useMotionValue , motion} from "motion/react";
import { useViewportSize } from "@/hooks/Viewport";
import { CANVAS_SIZE } from "@/constant";
import useRefStore from "@/store/Refs.store";

type MiniMapProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  dragging: boolean;
  setMovedminimap: Dispatch<SetStateAction<boolean>>;
};

const Minimap = ({ x, y, dragging, setMovedminimap }: MiniMapProps) => {

    const smallCanvasRef = useRefStore((state) => state.smallCanvasRef);
    const containerRef = useRef<HTMLDivElement>(null);
    const { height, width } = useViewportSize();
    
    const [isDraggingMinimap, setIsDraggingMinimap] = useState(false);

    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    
    useEffect(() => {
      if (!isDraggingMinimap) {
        miniX.set(-x.get() / 10);
        miniY.set(-y.get() / 10);
      }
    }, [ isDraggingMinimap, miniX, miniY,x,y]);

    useEffect(() => {
      const unsubscribeX = miniX.onChange((newX) => {
        if (!dragging && isDraggingMinimap) {
          x.set(-newX * 10);
        }
      });

      const unsubscribeY = miniY.onChange((newY) => {
        if (!dragging && isDraggingMinimap) {
          y.set(-newY * 10);
        }
      });

      return () => {
        unsubscribeX();
        unsubscribeY();
      };
    }, [x, y, miniX, miniY, dragging, isDraggingMinimap]);

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
            setMovedminimap((prev:boolean) => !prev);
          }}
          className="absolute top-0 left-0 cursor-grab border-2 rounded-xl border-blue-600 box active:cursor-grabbing"
          style={{
            width: width / 10,
            height: height / 10,
            x: miniX,
            y: miniY,
          }}
        />
      </div>
    );
  }


Minimap.displayName = "Minimap";

export default Minimap;