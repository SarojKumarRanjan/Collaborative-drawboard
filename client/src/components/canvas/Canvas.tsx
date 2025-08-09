import { CANVAS_SIZE } from "@/constant";
import { useViewportSize } from "@/hooks/Viewport";
import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useKeyPressEvent } from "react-use";
import Minimap from "./MiniMap";
import { useBoardPosition } from "@/store/BoardPosition";
import { socket } from "@/lib/Socket";
import { drawAllMoves } from "@/hooks/DrawFromSocket";
import {useDraw} from "@/hooks/useDraw.hook";
import { useSocketDraw } from "@/hooks/useSocketDraw";
import roomStore from "@/store/room.store";

const CanvasPage = () => {


const {users,myMoves,movesWithoutUser} = roomStore.getState();


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedminimap] = useState(false);
  const { height, width } = useViewportSize();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) setDragging(true);
  });

  const {x, y} = useBoardPosition();

  const copyCanvasToSmall = () => {
    if(canvasRef.current && smallCanvasRef.current){
      const smallCtx = smallCanvasRef.current.getContext("2d")
      if(smallCtx){
        smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height)
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const newCtx = canvasRef.current.getContext("2d");
      if (newCtx) {
        console.log("Canvas context created:", newCtx);
        setCtx(newCtx);
      }
    }
  }, []); 

  
  useEffect(() => {
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

useEffect(() =>{
  if(ctx){
    socket.emit("joined_room");
  }
},[ctx])


useEffect(() => {
  if(ctx){
    drawAllMoves(ctx, {users, movesWithoutUser, myMoves});
    copyCanvasToSmall()
  }
},[ctx, users, movesWithoutUser, myMoves]);


  const { handleDraw, handleEndDrawing, handleStartDrawing, handleUndo, drawing } = useDraw(
    dragging,
    ctx
  );


  
  useSocketDraw(ctx, drawing);




  return(
    <div className="relative w-full h-full overflow-hidden">
      <button className="absolute top-0" onClick={handleUndo}>
        undo
      </button>
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`${dragging && 'cursor-move'}`}
        style={{x, y}}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0
        }}
        dragElastic={0}
        dragTransition={{power: 0, timeConstant: 0}}
        onMouseDown={(e) => {
          handleStartDrawing(e.clientX, e.clientY)
        }}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          handleStartDrawing(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => {
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
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