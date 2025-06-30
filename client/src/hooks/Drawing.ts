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
            
            drawOnUndo(ctx,savedMoves,users)
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


    useEffect(() => {
        socket.on("joined",(roomJSON) => {
           const room:Room = new Map(JSON.parse(roomJSON));

           room.forEach((moves:any,userId:any) => {
            if(ctx){
                moves.forEach((move:any) => {
                    handleMove(move,ctx);
                    handelEnd();
                    setUser(userId,moves);
                })
            }
           })

           
        })

        return () => {
            socket.off("joined")
        }
    },[ctx, setUser, handelEnd]); 




    useEffect(() => {
        let movesToDrawLater:Move[] | undefined;
        let userIdLater = "";
        socket.on("user_draw",(move,userId)=>{

            if(ctx && !drawing){
                
                handleMove(move,ctx);

                setUser(userId,move)

              
            }else{
                movesToDrawLater?.push(move);
                userIdLater = userId;
            }

        })

        


        return () => {
            socket.off("user_undo")
            if(ctx && movesToDrawLater && userIdLater){
              movesToDrawLater.forEach((move) => {
                handleMove(move,ctx);
              });

            
                handelEnd();
                setUser(userIdLater,movesToDrawLater);
            }
            socket.off("user_draw")
        }

        //handle this carefully
    },[ctx,setUser,users,handelEnd,drawing])

    useEffect(() => {
       socket.on("user_undo",(userId:string) => {
           const newMoves =   users[userId].slice(0,-1)

           setUser(userId,newMoves)

           if(ctx){
            drawOnUndo(ctx,savedMoves,users)
            handelEnd()
           }
        })

        return () => {
            socket.off("user_undo");
        };
    }, [ctx, setUser, handelEnd,users]);

}