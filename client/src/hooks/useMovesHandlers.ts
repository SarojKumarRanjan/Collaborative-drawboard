import { socket } from "@/lib/Socket";
import useRefStore from "@/store/Refs.store";
import roomStore from "@/store/room.store";
import { useEffect, useMemo, useState } from "react";

let prevMovesLength = 0;

const useMovesHandlers = () => {
  const canvasRef = useRefStore((state) => state.canvasRef);
  const smallCanvasRef = useRefStore((state) => state.smallCanvasRef);

  const handleMyMoves = roomStore((state) => state.handleMyMoves);
  const handleRemoveMyMove = roomStore((state) => state.handleRemoveMyMove);
  const { usersMoves, movesWithoutUser, myMoves } = roomStore((state) => state);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) {
      setCtx(newCtx);
    }
  }, [canvasRef]);

  const sortedMoves = useMemo(() => {
    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((move) => moves.push(...move));
    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, [movesWithoutUser, myMoves, usersMoves]);

  const copyCanvasToSmall = () => {
    if (canvasRef.current && smallCanvasRef.current) {
      const smallCtx = smallCanvasRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
      }
    }
  };

  const drawMove = (move: Move) =>
    new Promise((resolve) => {
      const { path } = move;

      if (!ctx || !path.length) {
        resolve("bye");
        return;
      }

      const moveOptions = move.options;

      if (moveOptions.shape === "image") {
        const img = new Image();
        img.src = move.base64;
        img.addEventListener("load", () => {
          ctx?.drawImage(img, path[0][0], path[0][1]);
          copyCanvasToSmall();
          resolve("bye");
        });
        return;
      }

      ctx.lineWidth = moveOptions.lineWidth;
      ctx.strokeStyle = moveOptions.lineColor;
      if (move.eraser) {
        ctx.globalCompositeOperation = "destination-out";
      }
      switch (moveOptions.shape) {
        case "line":
          ctx.beginPath();
          ctx.moveTo(path[0][0], path[0][1]);
          path.forEach(([x, y]) => {
            ctx.lineTo(x, y);
          });
          ctx.stroke();
          ctx.closePath();
          break;
        case "rect":
          ctx.beginPath();
          ctx.rect(path[0][0], path[0][1], move.width, move.height);
          ctx.stroke();
          ctx.closePath();
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(path[0][0], path[0][1], move.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.closePath();
          break;
        default:
          break;
      }

      copyCanvasToSmall();
      resolve("bye");
    });


    const drawAllMoves = async( ) => {

        if(!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for(const move of sortedMoves) {
          await drawMove(move);
        }


    }


    useEffect(() => {
        socket.on("your_moves",(move:Move) => {
          
          handleMyMoves(move);
        })

        return () => {
            socket.off("your_moves");
        };
    }, [ handleMyMoves]);


   useEffect(() => {
        if(prevMovesLength>0 && sortedMoves.length || !prevMovesLength){
            drawAllMoves();
        }else{
            drawMove(sortedMoves[sortedMoves.length - 1])
        }

        return () => {
            prevMovesLength = sortedMoves.length;
        };
    },[sortedMoves])

    const handleUndo = () => {
        if(ctx){
            handleRemoveMyMove();
            socket.emit("undo")
        }
    }

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

      return {
         handleUndo,
         drawAllMoves,
         drawMove,
      }

 

};

export default useMovesHandlers;
