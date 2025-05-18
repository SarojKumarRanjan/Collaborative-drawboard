import {   forwardRef,  useEffect, useRef } from "react";
import type {Dispatch,SetStateAction} from "react"
import { MotionValue, useMotionValue , motion} from "motion/react";
import { useViewportSize } from "@/hooks/Viewport";
import { CANVAS_SIZE } from "@/constant";






type MiniMapProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  dragging: boolean;
  setMovedminimap: Dispatch<SetStateAction<boolean>>;
};

const Minimap = forwardRef<HTMLCanvasElement, MiniMapProps>(
  ({ x, y, dragging, setMovedminimap }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { height, width } = useViewportSize();

    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    useEffect(() => {
      miniX.onChange((newX) => {
        if (!dragging) x.set(-newX * 10);
      });

      miniY.onChange((newY) => {
        if (!dragging) y.set(-newY * 10);
      });

      return () => {
        miniX.clearListeners();
        miniY.clearListeners();
      };
    }, [x, y, miniX, miniY, dragging]);

    return (
      <div
        className="absolute right-10 top-10 z-50 bg-zinc-300"
        ref={containerRef}
        style={{
          width: CANVAS_SIZE.width / 10,
          height: CANVAS_SIZE.height / 10,
        }}
      >
        <canvas
          ref={ref}
          width={CANVAS_SIZE.width}
          height={CANVAS_SIZE.height}
          className="h-full w-full"
        >
          
        </canvas>

        <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragTransition={{ power: 0, timeConstant: 0 }}
            onDragEnd={() => setMovedminimap((prev) => !prev)}
            className="absolute top-0 left-0 cursor-grab border-2 border-blue-600 box"
            style={{
              width: width / 10,
              height: height / 10,
              x: miniX,
              y: miniY,
            }}
            animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
            transition={{ duration: 0.2 }}
          />
      </div>
    );
  }
);

Minimap.displayName = "Minimap";

export default Minimap;
