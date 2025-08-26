import { CANVAS_SIZE } from "@/constant";
import { useViewportSize } from "@/hooks/Viewport";
import { motion } from "motion/react";
import {  useState, useEffect } from "react";
import Minimap from "./MiniMap";
import { useBoardPosition } from "@/store/BoardPosition";
import { useDraw } from "@/hooks/useDraw.hook";
import { useSocketDraw } from "@/hooks/useSocketDraw";
import Background from "../toolbar/Background";
import { useParams } from "react-router-dom";
import { socket } from "@/lib/Socket";
import refStore from "@/store/Refs.store";
import useMovesHandlers from "@/hooks/useMovesHandlers";
import { useCtx } from "@/hooks/useCtx";

const CanvasPage = () => {
  const canvasRef = refStore((state) => state.canvasRef);
  const undoRef = refStore((state) => state.undoRef);
  const bgRef = refStore((state) => state.bgRef);
  const redoRef = refStore((state) => state.redoRef);

  const ctx = useCtx();
  const [dragging, setDragging] = useState(false);
  const [, setMovedminimap] = useState(false);
  const { height, width } = useViewportSize();

  const { roomid } = useParams<{ roomid?: string }>();

  const {  handleUndo,handleRedo } = useMovesHandlers();

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } = useDraw(
    dragging,
    
  );

  const { x, y } = useBoardPosition();



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
    if (undoRef) {
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
    if (redoRef) {
      const redoBtn = redoRef.current;

      if (redoBtn) {
        redoBtn.addEventListener("click", handleRedo);

        return () => {
          redoBtn.removeEventListener("click", handleRedo);
        };
      }
    }
  }, [redoRef, handleRedo]);

  useEffect(() => {
    if (ctx && roomid) {
      socket.emit("joined_room");
    }
  }, [ctx, roomid]);

  useSocketDraw( drawing);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Background bgRef={bgRef} />
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute z-10 ${
          dragging ? "cursor-move" : "cursor-crosshair"
        }`}
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
            handleDraw(e.clientX, e.clientY, e.shiftKey);
          }
        }}
        onTouchStart={(e) => {
          if (!dragging) {
            handleStartDrawing(
              e.changedTouches[0].clientX,
              e.changedTouches[0].clientY
            );
          }
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => {
          if (!dragging) {
            handleDraw(
              e.changedTouches[0].clientX,
              e.changedTouches[0].clientY
            );
          }
        }}
      />

      <Minimap
        x={x}
        y={y}
        dragging={dragging}
        setMovedminimap={setMovedminimap}
      />
    </div>
  );
};

export default CanvasPage;
