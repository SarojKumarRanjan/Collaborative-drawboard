import { CANVAS_SIZE } from "@/constant";
import { useViewportSize } from "@/hooks/Viewport";
import { motion } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import Minimap from "./MiniMap";
import { useBoardPosition } from "@/store/BoardPosition";
import { drawAllMoves } from "@/hooks/DrawFromSocket";
import { useDraw } from "@/hooks/useDraw.hook";
import { useSocketDraw } from "@/hooks/useSocketDraw";
import roomStore from "@/store/room.store";
import Background from "../toolbar/Background";
import { useParams } from "react-router-dom";
import { socket } from "@/lib/Socket";
import { optionStore } from "@/store/Options.store";

const CanvasPage = ({ undoRef }: { undoRef: React.RefObject<HTMLButtonElement> | null }) => {
  const usersMoves = roomStore((state) => state.usersMoves);
  const myMoves = roomStore((state) => state.myMoves);
  const movesWithoutUser = roomStore((state) => state.movesWithoutUser);
  const lineColor = optionStore((state) => state.lineColor);
  const lineWidth = optionStore((state) => state.lineWidth);
  const erase = optionStore((state) => state.erase);
  const shape = optionStore((state) => state.shape);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedminimap] = useState(false);
  const { height, width } = useViewportSize();

  const { roomid } = useParams<{ roomid?: string }>();

  const { handleDraw, handleEndDrawing, handleStartDrawing, handleUndo, drawing } = useDraw(
    dragging,
    ctx
  );

  const { x, y } = useBoardPosition();

  
  const copyCanvasToSmall = useCallback(() => {
    if (canvasRef.current && smallCanvasRef.current) {
      const smallCtx = smallCanvasRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
      }
    }
  }, []);

 
  useEffect(() => {
    if (canvasRef.current) {
      const newCtx = canvasRef.current.getContext("2d");
      if (newCtx) {
       
        setCtx(newCtx);
      }
    }
  }, []);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !dragging) {
        setDragging(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };



    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
     
    };
  }, [dragging, handleUndo]);

  
  useEffect(() => {
    if(undoRef){
        const undoBtn = undoRef.current;
    if (undoBtn) {
      undoBtn.addEventListener("click", handleUndo);
      return () => {
        undoBtn.removeEventListener("click", handleUndo);
      };
    }
    }
    
  }, [undoRef, handleUndo]);

 


  
  useEffect(() => {
    if (ctx) {
      drawAllMoves(ctx, { usersMoves, movesWithoutUser, myMoves },{lineColor,lineWidth,erase,shape});
      copyCanvasToSmall();
    }
  }, [ctx, usersMoves, movesWithoutUser, myMoves, copyCanvasToSmall, lineColor, lineWidth, erase, shape]);

  useEffect(()=>{
    if (ctx && roomid) {
      socket.emit("joined_room");
    }
  }, [ctx, roomid]);

  useSocketDraw(ctx, drawing);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Background />
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute z-10 ${dragging ? 'cursor-move' : 'cursor-crosshair'}`}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onMouseDown={(e) => {
          if (!dragging) {
            handleStartDrawing(e.clientX, e.clientY);
          }
        }}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          if (!dragging) {
            handleDraw(e.clientX, e.clientY,e.shiftKey);
          }
        }}
        onTouchStart={(e) => {
          if (!dragging) {
            handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => {
          if (!dragging) {
            handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }
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
  );
};

export default CanvasPage;