import { useBoardPosition } from "@/store/BoardPosition";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CANVAS_SIZE } from "@/constant";

const Background = () => {
  const { x, y } = useBoardPosition();

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ccc";

        for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(ctx.canvas.width, i);
          ctx.stroke();
          ctx.closePath();
        }

        for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, ctx.canvas.height);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  },[]);

  return (
    <motion.canvas
      ref={ref}
      className="absolute z-0 inset-0"
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
      style={{
        x: x,
        y: y,
      }}
    />
  );
};

export default Background;
