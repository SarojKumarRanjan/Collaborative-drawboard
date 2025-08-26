import { useState,useEffect } from "react"
import useRefStore from "@/store/Refs.store"

export const useCtx = () => {

    const canvasRef = useRefStore((state) => state.canvasRef);

    const [ctx,setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() =>{
       const newCtx = canvasRef.current?.getContext("2d");
       if(newCtx){
           setCtx(newCtx);
       }
    }, [canvasRef]);

    return ctx;
}