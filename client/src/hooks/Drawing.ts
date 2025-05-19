import {useState,useEffect, useCallback} from "react"
import {socket} from "@/lib/Socket"
import { useOptions } from "@/store/Index";
import { drawOnUndo } from "./DrawFromSocket";
import {  useUsers} from "@/store/Users";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { useSetUser } from "@/store/Users";


// eslint-disable-next-line prefer-const
let savedMoves:[number,number][][] =[];
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
        savedMoves.push(moves)
        socket.emit("draw",moves,options );

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
    handelEnd: () => void
) => {
    
    const users = useUsers()
    const setUser = useSetUser();
    useEffect(() => {
        socket.on("user_draw",(newMoves,options,userId)=>{

            if(ctx){
                ctx.lineWidth = options.lineWidth
                ctx.strokeStyle = options.lineColor

                ctx.beginPath()

                newMoves.forEach(([x,y]:[number,number])=>{
                    ctx.lineTo(x,y)

                })

                ctx.stroke()
                ctx.closePath()

                handelEnd()

                setUser(userId,newMoves)
            }

        })

        socket.on("user_undo",(userId:string) => {
           const newMoves =   users[userId].slice(0,-1)

           setUser(userId,newMoves)

           if(ctx){
            drawOnUndo(ctx,savedMoves,users)
            handelEnd()
           }
        })


        return () => {
            socket.off("user_undo")
            socket.off("user_draw")
        }

        //handle this carefully
    },[ctx,setUser,users,handelEnd])

}