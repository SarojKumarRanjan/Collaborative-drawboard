import { useCallback, useEffect, useState } from "react";
import { socket } from "@/lib/Socket";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import roomStore from "@/store/room.store";
import { optionStore } from "@/store/Options.store";
import { drawAllMoves } from "./DrawFromSocket";
import { drawLine, drawCircle, drawRect } from "./DrawFromSocket";

let tempMoves: [number, number][] = [];
let tempRadius = 0;
let tempReact = {
  width: 0,
  height: 0,
};

export const setCtxOptions = (
  ctx: CanvasRenderingContext2D | undefined,
  option: CtxOptions
) => {
  if (!ctx) return;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = option.lineWidth;
  ctx.strokeStyle = option.lineColor;
  if (option.erase) {
    ctx.globalCompositeOperation = "destination-out";
  }
};

export const useDraw = (
  blocked: boolean,
  ctx?: CanvasRenderingContext2D | undefined
) => {
  const handleMyMoves = roomStore((state) => state.handleMyMoves);
  const handleRemoveMyMove = roomStore((state) => state.handleRemoveMyMove);
  const lineColor = optionStore((state) => state.lineColor);
  const lineWidth = optionStore((state) => state.lineWidth);
  const erase = optionStore((state) => state.erase);
  const shape = optionStore((state) => state.shape);
  const myMoves = roomStore((state) => state.myMoves);
  const movesWithoutUser = roomStore((state) => state.movesWithoutUser);
  const usersMoves = roomStore((state) => state.usersMoves);
  const users = roomStore((state) => state.users);
  const roomId = roomStore((state) => state.roomId);

  const position = useBoardPosition();
  const movedX = position.x;
  const movedY = position.y;
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      setCtxOptions(ctx, {
        lineColor,
        lineWidth,
        erase,
        shape,
      });
    }
  });

  useEffect(() => {
    socket.on("your_moves", (move) => {
      //console.log(move);

      handleMyMoves(move);
    });

    return () => {
      socket.off("your_moves");
    };
  }, [handleMyMoves]);

  const handleUndo = useCallback(() => {
    if (ctx) {
      handleRemoveMyMove();
      socket.emit("undo");
    }
  }, [ctx, handleRemoveMyMove]);

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

    const finalX = getPosition(x, movedX);
    const finalY = getPosition(y, movedY);

    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(finalX, finalY);
    ctx.stroke();
    tempMoves.push([finalX, finalY]);
  };

  const handleEndDrawing = () => {
    if (!ctx) return;

    setDrawing(false);
    ctx.closePath();

    if (shape !== "circle") tempRadius = 0;
    if (shape !== "rect") tempReact = { width: 0, height: 0 };

    const move: Move = {
      path: tempMoves,
      shape: shape,
      radius: tempRadius,
      width: tempReact.width,
      height: tempReact.height,

      options: {
        lineColor: lineColor,
        lineWidth: lineWidth,
        erase: erase,
        shape: shape,
      },
      timestamp: 0,
      eraser: erase,
    };

    tempMoves = [];
    ctx.globalCompositeOperation = "source-over";
    socket.emit("draw", move);
  };

  const handleDraw = (x: number, y: number, shiftKey?: boolean) => {
    if (!ctx || !drawing || blocked) {
      return;
    }

    const finalX = getPosition(x, movedX);
    const finalY = getPosition(y, movedY);

    switch (shape) {
      case "line":
        if (shiftKey) {
          tempMoves = tempMoves.slice(0, 1);
          drawAllMoves(
            ctx,
            { usersMoves, myMoves, movesWithoutUser, users, id: roomId },
            { lineColor, lineWidth, shape, erase }
          );
          setCtxOptions(ctx, {
            lineColor,
            lineWidth,
            erase,
            shape,
          });
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shiftKey);
        tempMoves.push([finalX, finalY]);
        break;
      case "rect":
        drawAllMoves(
          ctx,
          { usersMoves, myMoves, movesWithoutUser, users, id: roomId },
          { lineColor, lineWidth, shape, erase }
        );
        tempReact = drawRect(ctx, tempMoves[0], finalX, finalY);
        break;

      case "circle":
        drawAllMoves(
          ctx,
          { usersMoves, myMoves, movesWithoutUser, users, id: roomId },
          { lineColor, lineWidth, shape, erase }
        );
        tempRadius = drawCircle(ctx, tempMoves[0], finalX, finalY);
        break;
      default:
        break;
    }
  };

  return {
    handleDraw,
    handleStartDrawing,
    handleEndDrawing,
    drawing,
    handleUndo,
  };
};
