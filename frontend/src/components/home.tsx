"use client"
import { useEffect, useRef, useState } from "react";
import { useDraw } from "@/hooks/drawing";
import { socket } from "@/lib/socket";

export default function HomePage(){

    //ref of the canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    //refrence for the context elements
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [size,setSize] = useState({width:0,height:0})

    // this is the options
    const [options,setOptions] = useState<CtxOptions>({
        lineColor:"#000",
        lineWidth:5
    })



// these are the hooks defined for drawing
    const {
        handleDraw,
        handleEndDrawing,
        handleStartDrawing,
        drawing
    } = useDraw(options,ctxRef.current as CanvasRenderingContext2D);


    //useEffect for hadling the size of the canvas

    useEffect(() =>{
        const handleresize = () => {
            setSize({height:window.innerHeight ,width: window.innerWidth})
        }
        
        window.addEventListener("resize",handleresize);
        handleresize();
        
        // remove event listener upon unmount
        return () =>{
           window.removeEventListener("resize",handleresize) 

        };
    },[]);


    //useEffect to assign ref based on the context

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext("2d");
            if(ctx) ctxRef.current = ctx;
        }
    },[options.lineColor,options.lineWidth])


    const drawFromSocket = (
        socketMoves:[number,number][],
        socketOptions:CtxOptions
    )=>{

        const tempCtx = ctxRef.current;
        if(tempCtx){
            tempCtx.lineWidth = socketOptions.lineWidth
            tempCtx.strokeStyle = socketOptions.lineColor

            tempCtx.beginPath()

            socketMoves.forEach(([x,y]) =>{
                
                tempCtx.lineTo(x,y)
                tempCtx.stroke()
            })
            tempCtx.closePath()
        }

    }

    // useEffect to listen to socket events

    useEffect(() => {
        let movesToDrawLater:[number,number][] = [];
        let optionsToUseLater:CtxOptions = {
            lineColor:"",
            lineWidth:0,
        };

        socket.on("socket_draw",(movesToDraw,socketOptions)=>{
            if(ctxRef.current && !drawing){
              drawFromSocket(movesToDraw,socketOptions)
            }else{
                movesToDrawLater = movesToDraw
                optionsToUseLater = socketOptions
            }

        })

        return () => {
            socket.off("socket_draw")

            if(movesToDrawLater.length){
                drawFromSocket(movesToDrawLater,optionsToUseLater)
            }
        }
    },[drawing])

    return(
        <div className="flex h-full w-full justify-center  items-center">
            <button
            onClick={() => {
                setOptions({lineColor:"blue",lineWidth:5})
            }}
            className="absolute bg-black"
            >
               blue
            </button>
            <canvas
            className="h-full w-full"
            ref={canvasRef}
            onMouseDown={(e) => {
                 handleStartDrawing(e.clientX,e.clientY)
            }}
            onMouseUp={handleEndDrawing}
            onMouseMove={(e) =>{
                handleDraw(e.clientX,e.clientY)

            }}
            onTouchStart={(e) =>{
                 handleStartDrawing(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
            }}
            onTouchEnd={handleEndDrawing}
            onTouchMove={(e)=>{
                 handleDraw(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
            }}
            height={size.height}
            width={size.width}

            />
           
        </div>
    )
}