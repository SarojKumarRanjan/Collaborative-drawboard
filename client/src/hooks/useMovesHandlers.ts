import { socket } from "@/lib/Socket";
import useRefStore from "@/store/Refs.store";
import roomStore from "@/store/room.store";
import { useEffect, useMemo } from "react";
import useSavedMovesStore from "@/store/SavedMoves.store";
import { useCtx } from "./useCtx";
import { useSelection } from "./useSelection";
import { optionStore } from "@/store/Options.store";

let prevMovesLength = 0;

const useMovesHandlers = (clearOnYourMove: () => void) => {
  const canvasRef = useRefStore((state) => state.canvasRef);
  const smallCanvasRef = useRefStore((state) => state.smallCanvasRef);
  const setSelection = optionStore((state) => state.setSelection)
  const handleMyMoves = roomStore((state) => state.handleMyMoves);
  const handleRemoveMyMove = roomStore((state) => state.handleRemoveMyMove);
  const { usersMoves, movesWithoutUser, myMoves } = roomStore((state) => state);
  const removeSavedMoves = useSavedMovesStore((state) => state.removeSavedMoves);
  const addSavedMove = useSavedMovesStore((state) => state.addSavedMove);

  const ctx = useCtx();

 

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

      if(moveOptions.mode==="select"){
        return;
      }

     

      ctx.lineWidth = moveOptions.lineWidth;
      ctx.strokeStyle = moveOptions.lineColor;
      ctx.fillStyle = moveOptions.fillColor;
      if (move.options.mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      }else{
        ctx.globalCompositeOperation = "source-over";
      }

       if (moveOptions.shape === "image" && image) {
        ctx.drawImage(image, path[0][0], path[0][1]);
        
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
          case "rect":{
            const {width,height} = move.rect
            ctx.beginPath();
           
            
            ctx.rect(path[0][0], path[0][1], width, height);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
          }
          break;
        case "circle":{
          const {cX,cY,radiusX,radiusY} = move.circle
          ctx.beginPath();
          ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
        }
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
            img.src = move.img.base64;
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
          clearOnYourMove();
          handleMyMoves(move);
          setTimeout(() => {
            setSelection(null)
          },100)
        })

        return () => {
            socket.off("your_moves");
        };
    }, [ handleMyMoves, clearOnYourMove,setSelection]);


useSelection(drawAllMoves);

 useEffect(() => {
  if ((prevMovesLength > 0 && sortedMoves.length) || !prevMovesLength) {
    drawAllMoves();
  } else {
    if (sortedMoves.length > 0) {   
      const lastMove = sortedMoves[sortedMoves.length - 1];
      if (lastMove.options.shape === "image") {
        const img = new Image();
        img.src = lastMove.img.base64;
        img.addEventListener("load", () => {
          drawMove(lastMove, img);
        });
      } else {
        drawMove(lastMove);
      }
    }
  }

  return () => {
    prevMovesLength = sortedMoves.length;
  };
}, [sortedMoves]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleUndo = () => {
        if(ctx){
          const move =   handleRemoveMyMove();

          if(move?.options?.mode==="select"){
             setSelection(null);
          }else if(move){

            addSavedMove(move);
             socket.emit("undo")
          }
           
           
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleRedo = () => {
        if(ctx){
          const move =  removeSavedMoves();
         

          if(move){

            socket.emit("draw", move)
          }
        }
      }

      useEffect(() => {
        const handleUndoRedoKeyboard = (e: KeyboardEvent) => {
          
          
          if (e.key === "z" && e.ctrlKey) {
            handleUndo();
          }else if(e.key === "x" && e.ctrlKey ){
            
            handleRedo();
          }
        };
    
        document.addEventListener("keydown", handleUndoRedoKeyboard);
    
        return () => {
          document.removeEventListener("keydown", handleUndoRedoKeyboard);
        };
      }, [handleUndo,handleRedo]);

      return {
         handleUndo,
          handleRedo,
         drawAllMoves,
         drawMove,
      }

    

};

export default useMovesHandlers;
