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

  const drawMove = (move: Move,image?:HTMLImageElement) => {
      const { path } = move;

      if (!ctx || !path.length) {
        
        return;
      }

      const moveOptions = move.options;

      if (moveOptions.shape === "image" && image) {
        ctx.drawImage(image, path[0][0], path[0][1]);
        
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
      
    }


    const drawAllMoves = async( ) => {

        if(!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const images = await Promise.all(
          sortedMoves.filter(move => move.options.shape === "image").map(async (move) => {
            const img = new Image();
            img.id = move.id as string;
            img.src = move.base64;
            await new Promise((resolve) => {
              img.addEventListener("load", resolve);
            });
            return img;
          })
        );

        sortedMoves.forEach((move) => {
          const image = images.find((img) => img.id === move.id);
          if(image){
            drawMove(move, image);
          }else{
            drawMove(move);
          }
        });

       copyCanvasToSmall();


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
          const lastMove = sortedMoves[sortedMoves.length - 1];
           if(lastMove.options.shape === "image"){
            const img = new Image();
            img.src = lastMove.base64;
            img.addEventListener("load", () => {
              drawMove(lastMove, img);
            });
           }else{
            drawMove(lastMove);
           }
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
