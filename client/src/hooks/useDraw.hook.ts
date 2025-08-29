import {  useState } from "react";
import { socket } from "@/lib/Socket";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { optionStore } from "@/store/Options.store";
import roomStore from "@/store/room.store";
import { drawLine, drawCircle, drawRect } from "./DrawFromSocket";
import useSavedMovesStore from "@/store/SavedMoves.store";
import { useCtx } from "./useCtx";
import { DEFAULT_MOVE } from "@/constant";


let tempMoves: [number, number][] = [];
let tempCircle = {
  cX: 0,
  cY: 0,
  radiusX: 0,
  radiusY: 0,
};
let tempReact = {
  width: 0,
  height: 0,
};
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const lineColor = optionStore((state) => state.lineColor);
  const lineWidth = optionStore((state) => state.lineWidth);
  const mode = optionStore((state) => state.mode);
  const shape = optionStore((state) => state.shape);
  const clearSavedMoves = useSavedMovesStore((state) => state.clearSavedMoves);
  const setSelection = optionStore((state) => state.setSelection);
  const selection = optionStore((state) => state.selection);
  const fillColor = optionStore((state) => state.fillColor);
  const handleMyMoves = roomStore((state) => state.handleMyMoves);

  const position = useBoardPosition();
  const movedX = position.x;
  const movedY = position.y;
  const [drawing, setDrawing] = useState(false);

  const ctx = useCtx();

  const setCtxOptions = () => {
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.fillStyle = fillColor;
      if (mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
    }
  };

  const drawAndSet = () => {
    if (!tempImageData && ctx) {
      tempImageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }

    if (tempImageData && ctx) {
      ctx.putImageData(tempImageData, 0, 0);
    }
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    const finalX = getPosition(x, movedX);
    const finalY = getPosition(y, movedY);

    setDrawing(true);
    setCtxOptions();
    drawAndSet();
    if (shape === "line" && mode !== "select") {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }
    tempMoves.push([finalX, finalY]);
  };

  const handleEndDrawing = () => {
    if (!ctx) return;



    setDrawing(false);
    ctx.closePath();

    let addMove = true

    if(mode==="select" && tempMoves.length){
      clearOnYourMove();
      let x = tempMoves[0][0];
      let y = tempMoves[0][1];
      let width = tempMoves[tempMoves.length - 1][0] - x;
      let height = tempMoves[tempMoves.length - 1][1] - y;
      
      if(width <0){
        width -= 4
        x+=2;
      }else{
        width +=4;
        x-=2;
      }

      if(height<0){
        height -= 4
        y+=2;
      }else{
        height +=4;
        y-=2;
      }

      if((width <4 || width > 4) && (height<4 || height > 4)){
        setSelection({ x, y, width, height });
      }else{
        setSelection(null);
        addMove = false;
      }
    }

    const move: Move = {
      ...DEFAULT_MOVE,
      path: tempMoves,
      rect: {
        ...tempReact,
      },
      circle: {
        ...tempCircle,
      },
      options: {
        lineColor: lineColor,
        lineWidth: lineWidth,
        fillColor: fillColor,
        mode: mode,
        shape: shape,
        selection: selection
      },
    };

    tempMoves = [];
    tempCircle = {
      cX: 0,
      cY: 0,
      radiusX: 0,
      radiusY: 0,
    };
    tempReact = { width: 0, height: 0 };



    tempImageData = undefined;

    if(mode !== "select"){
         socket.emit("draw", move);
         clearSavedMoves();
    }else{
      if(addMove){
        handleMyMoves(move);
      }
      
    }
   
  };

  const handleDraw = (x: number, y: number, shiftKey?: boolean) => {
    if (!ctx || !drawing || blocked) {
      return;
    }

    const finalX = getPosition(x, movedX);
    const finalY = getPosition(y, movedY);
    drawAndSet();

    if (mode === "select") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";


      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      
      tempMoves.push([finalX, finalY]);
      setCtxOptions();
      return;
    }

    switch (shape) {
      case "line":
        if (shiftKey) {
          tempMoves = tempMoves.slice(0, 1);
        }
        drawLine(ctx, tempMoves[0], finalX, finalY, shiftKey);
        tempMoves.push([finalX, finalY]);
        break;
      case "rect":
        tempReact = drawRect(ctx, tempMoves[0], finalX, finalY);
        break;

      case "circle":
        tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY);
        break;
      default:
        break;
    }
  };

  const clearOnYourMove = () => {
    drawAndSet();
    tempImageData = undefined;
  }

  return {
    handleDraw,
    handleStartDrawing,
    handleEndDrawing,
    drawing,
    clearOnYourMove,
  };
};
