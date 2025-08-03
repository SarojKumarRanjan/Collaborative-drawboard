/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState,useEffect, useCallback} from "react"
import {socket} from "@/lib/Socket"
import { useOptions } from "@/store/Index";
import { drawAllMoves } from "./DrawFromSocket";
import {  useUsers} from "@/store/Users";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { useSetUser } from "@/store/Users";
import { handleMove } from "./DrawFromSocket";


const movesWithoutUser:Move[] = [];
const savedMoves:Move[] =[];
let tempMoves:[number,number][] = [];

export const useDraw = (
    blocked : boolean,
    handleEnd : () => void,
    ctx?:CanvasRenderingContext2D | undefined
) => {
    const position   = useBoardPosition();
    const movedX = position.x
    const movedY = position.y
    const users = useUsers();
    const options  = useOptions();
    const [drawing,setDrawing] = useState(false)

    useEffect(() => {
        if(ctx){
            ctx.lineJoin = "round"
            ctx.lineCap  = "round"
            ctx.lineWidth = options.lineWidth
            ctx.strokeStyle  = options.lineColor
        }
    })

    //handle undo function
    const handleUndo = useCallback(() => {
        if(ctx){
            savedMoves.pop();
            socket.emit("undo")
            drawAllMoves(ctx,movesWithoutUser,savedMoves,users);
            handleEnd();
        }
    },[ctx,handleEnd,users])

    // handle ctrl z for the undo part
    useEffect(() => {
        const handleUndoKeyboard = (e:KeyboardEvent)=>{
            if(e.key==='z' && e.ctrlKey){
                handleUndo()
            }
        }

        document.addEventListener("keydown",handleUndoKeyboard);

        return () => {
            document.removeEventListener("keydown",handleUndoKeyboard)
        }
    },[handleUndo])

    const handleStartDrawing = (x:number,y:number)=>{
        if(!ctx || blocked) return;
        
        setDrawing(true)
        ctx.beginPath()
        ctx.lineTo(getPosition(x,movedX),getPosition(y,movedY))
        ctx.stroke()
        tempMoves.push([getPosition(x,movedX),getPosition(y,movedY)])
    }

    const handleEndDrawing = () =>{
        if(!ctx) return;

        setDrawing(false)
        ctx.closePath();

        const move:Move = {
           path: tempMoves,
           options
        }
        savedMoves.push(move)
        tempMoves = []
        socket.emit("draw",move );
         drawAllMoves(ctx,movesWithoutUser,savedMoves,users);
        
        handleEnd();
    }

    const handleDraw = (x:number,y:number) => {
         if(!ctx || !drawing || blocked) {
            return
         }
            
         ctx.lineTo(getPosition(x,movedX),getPosition(y,movedY));
         ctx.stroke()
         tempMoves.push([getPosition(x,movedX),getPosition(y,movedY)]);
    }

    return{
        handleDraw,
        handleStartDrawing,
        handleEndDrawing,
        drawing,
        handleUndo
    }
}

export const useSocketDraw = (
    ctx:CanvasRenderingContext2D | undefined,
    drawing:boolean,
    handelEnd: () => void
) => {
    const users = useUsers()
    const setUser = useSetUser();
  
    useEffect(() => {
        if (ctx) {
            socket.emit("joined_room")
        }
    }, [ctx])

    useEffect(() => {
        const handleJoined = (room:any,usersToParse:any) => {
            if(!ctx) return;

            const users = new Map<string, Move[]>(JSON.parse(usersToParse));

          room.drawed.forEach((element: any) => {
                if (element.path && element.path.length > 0) {
                    handleMove(element, ctx);
                    movesWithoutUser.push(element);
                }

            });

            users.forEach((moves: Move[], userId: string) => {
                if (moves.length > 0) {
                    moves.forEach((move: Move) => {
                        handleMove(move, ctx);
                    });
                }
                setUser(userId, moves);
            });

            handelEnd();
        };



        socket.on("room", handleJoined);

        return () => {
            socket.off("room", handleJoined);
        }
    }, [ctx, setUser, handelEnd]); 


    // Handle real-time drawing from other users
    useEffect(() => {
        const movesToDrawLater: Move[] = [];
        let userIdLater = "";
        
        const handleUserDraw = (move: any, userId: string) => {
            if (ctx && !drawing) {
                // Draw immediately if we're not drawing and have context
                handleMove(move, ctx);
                setUser(userId, move);
            } else {
                // Queue moves to draw later
                movesToDrawLater.push(move);
                userIdLater = userId;
            }
        };

        socket.on("user_draw", handleUserDraw);

        return () => {
            socket.off("user_draw", handleUserDraw);
            
            // Draw queued moves on cleanup
            if (ctx && movesToDrawLater.length > 0 && userIdLater) {
                movesToDrawLater.forEach((move) => {
                    handleMove(move, ctx);
                });
                handelEnd();
                setUser(userIdLater, movesToDrawLater);
            }
        }
    }, [ctx, setUser, users, handelEnd, drawing])

    // Handle undo from other users
    useEffect(() => {
        const handleUserUndo = (userId: string) => {
            const userMoves = users[userId];
            if (userMoves && userMoves.length > 0) {
                const newMoves = userMoves.slice(0, -1);
                setUser(userId, newMoves);

                if (ctx) {
                    // Redraw all moves after undo
                    drawAllMoves(ctx,movesWithoutUser, savedMoves, users);
                    handelEnd();
                }
            }
        };

        socket.on("user_undo", handleUserUndo);

        return () => {
            socket.off("user_undo", handleUserUndo);
        };
    }, [ctx, setUser, handelEnd, users]);
}