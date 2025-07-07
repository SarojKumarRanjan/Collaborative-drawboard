/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState,useEffect, useCallback} from "react"
import {socket} from "@/lib/Socket"
import { useOptions } from "@/store/Index";
import { drawOnUndo } from "./DrawFromSocket";
import {  useUsers} from "@/store/Users";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { useSetUser } from "@/store/Users";
import { handleMove } from "./DrawFromSocket";

// eslint-disable-next-line prefer-const
let savedMoves:Move[] =[];
let moves:[number,number][] = [];

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
            drawOnUndo(ctx,savedMoves,users);
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
    }

    const handleEndDrawing = () =>{
        if(!ctx) return;

        setDrawing(false)
        ctx.closePath();

        const move:Move = {
           path:moves,
           options
        }
        savedMoves.push(move)
        socket.emit("draw",move );

        moves = []
        handleEnd();
    }

    const handleDraw = (x:number,y:number) => {
         if(!ctx || !drawing || blocked) {
            return
         }
            
         ctx.lineTo(getPosition(x,movedX),getPosition(y,movedY));
         ctx.stroke()
         moves.push([getPosition(x,movedX),getPosition(y,movedY)]);
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
    const [pendingRoomData, setPendingRoomData] = useState<string | null>(null);


    useEffect(() => {
        socket.emit("joined_room")
    },[])
   
    useEffect(() => {
        const handleJoined = (roomJSON: string) => {
            
            
            if (!ctx) {
               
                setPendingRoomData(roomJSON);
                return;
            }
            
            
            processRoomData(roomJSON, ctx, setUser, handelEnd);
        };



        socket.on("room", handleJoined);

        return () => {
            socket.off("room", handleJoined);
        }
    }, [ctx, setUser, handelEnd]); 

    // Process pending room data when ctx becomes available
    useEffect(() => {
        if (ctx && pendingRoomData) {
            //console.log("Canvas now ready, processing pending room data");
            processRoomData(pendingRoomData, ctx, setUser, handelEnd);
            setPendingRoomData(null); 
        }
    }, [ctx, pendingRoomData, setUser, handelEnd]);

    // Helper function to process room data
    const processRoomData = (roomJSON: string, context: CanvasRenderingContext2D, setUserFn: any, handleEndFn: () => void) => {
        try {
            const room: Room = new Map(JSON.parse(roomJSON));
           // console.log("Processing room data, canvas context available:", !!context);
           // console.log("Room data:", room);
            
            // Clear canvas before drawing existing moves
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            
            room.forEach((moves: any, userId: any) => {
               // console.log(`User ${userId} has ${moves.length} moves`);
                
                if (moves.length > 0) {
                    moves.forEach((move: any) => {
                        console.log("Drawing move:", move);
                        handleMove(move, context);
                    });
                }
                
                // Update user state
                setUserFn(userId, moves);
            });
            
            // Call handleEnd once after all moves are processed
            handleEndFn();
            
        } catch (error) {
            console.error("Error processing room data:", error);
        }
    };

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
                    drawOnUndo(ctx, savedMoves, users);
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