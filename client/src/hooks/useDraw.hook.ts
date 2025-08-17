import { useEffect, useState } from "react";
import { socket } from "@/lib/Socket";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { optionStore } from "@/store/Options.store";
import { drawLine, drawCircle, drawRect } from "./DrawFromSocket";
import useRefStore from "@/store/Refs.store";

let tempMoves: [number, number][] = [];
let tempRadius = 0;
let tempReact = {
  width: 0,
  height: 0,
};

export const useDraw = (blocked: boolean, drawAllMoves: () => void) => {
  const canvasRef = useRefStore((state) => state.canvasRef);
  const lineColor = optionStore((state) => state.lineColor);
  const lineWidth = optionStore((state) => state.lineWidth);
  const erase = optionStore((state) => state.erase);
  const shape = optionStore((state) => state.shape);

  const position = useBoardPosition();
  const movedX = position.x;
  const movedY = position.y;
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) {
      setCtx(newCtx);
    }
  }, [canvasRef]);

  const setCtxOptions = () => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      if (erase) {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
    }
  };

  const drawAndSet = () => {
    drawAllMoves()
    setCtxOptions()
  }

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    const finalX = getPosition(x, movedX);
    const finalY = getPosition(y, movedY);

    setDrawing(true);
    setCtxOptions();
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
      base64: "",
    };

    tempMoves = [];
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
         
         drawAndSet()
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shiftKey);
        tempMoves.push([finalX, finalY]);
        break;
      case "rect":
        drawAndSet();
        tempReact = drawRect(ctx, tempMoves[0], finalX, finalY);
        break;

      case "circle":
        drawAndSet();
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
    
  };
};
