import {useState,useEffect} from "react"
import {socket} from "@/lib/Socket"
import { useOptions } from "@/store/Index";

let moves:[number,number][] = [];

export const useDraw = (
    blocked : boolean,
    movedX:number,
    movedY:number,
    handleEnd : () => void,
    ctx?:CanvasRenderingContext2D | undefined
    

) => {

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


    const handleStartDrawing = (x:number,y:number)=>{

        if(!ctx || blocked) return;


            moves = [[x+movedX,y+movedY]];
            setDrawing(true)
            ctx.beginPath()
            ctx.lineTo(x+movedX,y+movedY)
            ctx.stroke()
        
    }

    const handleEndDrawing = () =>{
        if(!ctx) return;

        socket.emit("draw",moves,options );
        setDrawing(false)
        ctx.closePath();
        handleEnd();
    }


    const handleDraw = (x:number,y:number) => {

         if(ctx && drawing && !blocked){
            moves.push([x+movedX,y+movedY]);
            ctx.lineTo(x+movedX,y+movedY);
            ctx.stroke()
         }
    }


    return{
        handleDraw,
        handleStartDrawing,
        handleEndDrawing,
        drawing
    }

 
}