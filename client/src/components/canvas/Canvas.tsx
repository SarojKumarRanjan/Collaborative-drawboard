
import { CANVAS_SIZE } from "@/constant";
import { useDraw } from "@/hooks/Drawing";
import { useViewportSize } from "@/hooks/Viewport";
import { useMotionValue,motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useKeyPressEvent } from "react-use";
import { socket } from "@/lib/Socket";
import { drawFromSocket } from "@/hooks/DrawFromSocket";
import Minimap from "./MiniMap";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedminimap] = useState(false);
  const { height, width } = useViewportSize();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) setDragging(true);
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const copyCanvasToSmall = () => {
    if (canvasRef.current) {
      smallCanvasRef.current
        ?.getContext("2d")
        ?.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
    }
  };

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } = useDraw(
    dragging,
    -x.get(),
    -y.get(),
    copyCanvasToSmall,
    ctx
  );

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) setCtx(newCtx);

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dragging]);

  useEffect(() => {
    let movesToDrawLater: [number, number][] = [];
    let optionsToUseLater: CtxOptions = {
      lineColor: "",
      lineWidth: 0,
    };

    socket.on("socket_draw", (movesToDraw, socketOptions) => {
      if (ctx && !drawing) {
        drawFromSocket(
          movesToDraw,
          socketOptions,
          ctx as CanvasRenderingContext2D,
          copyCanvasToSmall
        );
      } else {
        movesToDrawLater = movesToDraw;
        optionsToUseLater = socketOptions;
      }
    });

    return () => {
      socket.off("socket_draw");

      if (movesToDrawLater.length && ctx) {
        drawFromSocket(
          movesToDrawLater,
          optionsToUseLater,
          ctx as CanvasRenderingContext2D,
          copyCanvasToSmall
        );
      }
    };
  }, [drawing, ctx]);


  return(
    <div className="w-full h-full overflow-hidden"
    >
        <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`${dragging && 'cursor-move'}`}
        style={{x,y}}
        drag={dragging}
        dragConstraints={{
            left: -(CANVAS_SIZE.width - width),
            right:0,
            top: -(CANVAS_SIZE.height - height),
            bottom:0
        }}
        dragElastic={0}
        dragTransition={{power:0,timeConstant:0}}
        onMouseDown={(e) => {
                 handleStartDrawing(e.clientX,e.clientY)
            }}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) =>{
                handleDraw(e.clientX,e.clientY)

            }}
         onTouchStart={(e) =>{
                 handleStartDrawing(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
            }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e)=>{
                 handleDraw(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
            }}

        />

        <Minimap
        ref={smallCanvasRef}
        x={x}
        y={y}
        dragging={dragging}
        setMovedminimap={setMovedminimap}
        />
    </div>
  )
};

export default CanvasPage;
