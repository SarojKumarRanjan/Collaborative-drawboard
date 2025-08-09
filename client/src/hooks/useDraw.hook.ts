import { useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/Socket";
import { useOptions } from "@/store/Index";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import roomStore from "@/store/room.store";

let tempMoves: [number, number][] = [];

export const useDraw = (
  blocked: boolean,
  ctx?: CanvasRenderingContext2D | undefined
) => {
  const { handleMyMoves, handleRemoveMyMove } = roomStore.getState();

  const position = useBoardPosition();
  const movedX = position.x;
  const movedY = position.y;
  const options = useOptions();
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

  //handle undo function
  const handleUndo = useCallback(() => {
    if (ctx) {
      handleRemoveMyMove();
      socket.emit("undo");
    }
  }, [ctx, handleRemoveMyMove]);

  // handle ctrl z for the undo part
  useEffect(() => {
    const handleUndoKeyboard = (e: KeyboardEvent) => {
      if (e.key === "z" && e.ctrlKey) {
        handleUndo();
      }
    };

    document.addEventListener("keydown", handleUndoKeyboard);

    return () => {
      document.removeEventListener("keydown", handleUndoKeyboard);
    };
  }, [handleUndo]);

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(getPosition(x, movedX), getPosition(y, movedY));
    ctx.stroke();
    tempMoves.push([getPosition(x, movedX), getPosition(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx) return;

    setDrawing(false);
    ctx.closePath();

    const move: Move = {
      path: tempMoves,
      options,
    };
    handleMyMoves(move);
    tempMoves = [];
    socket.emit("draw", move);
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) {
      return;
    }

    ctx.lineTo(getPosition(x, movedX), getPosition(y, movedY));
    ctx.stroke();
    tempMoves.push([getPosition(x, movedX), getPosition(y, movedY)]);
  };

  return {
    handleDraw,
    handleStartDrawing,
    handleEndDrawing,
    drawing,
    handleUndo,
  };
};
