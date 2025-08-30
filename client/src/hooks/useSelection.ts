/* eslint-disable react-hooks/exhaustive-deps */
import { optionStore } from "@/store/Options.store";
import useRefStore from "@/store/Refs.store";
import { useCtx } from "./useCtx";
import { useEffect, useMemo } from "react";
import { socket } from "@/lib/Socket";
import { DEFAULT_MOVE } from "@/constant";

let tempSelection = {
  x:0,
  y:0,
  width:0,
  height:0
}

export const useSelection = (drawAllMoves: () => Promise<void>) => {
  const selection = optionStore((state) => state.selection);
  const { lineColor, lineWidth } = optionStore((state) => state);
  const ctx = useCtx();
  const bgRef = useRefStore((state) => state.bgRef);
  const selectionRef = useRefStore((state) => state.selectionRef);
  const setMoveImage = useRefStore((state) => state.setMoveImage);
  

  useEffect(() => {
    const callback = async () => {
      
      if (ctx && selection) {
        await drawAllMoves();

        setTimeout(() =>{

            const { x, y, width, height } = selection;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.setLineDash([5, 10]);
        ctx.globalCompositeOperation = "destination-over";

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);

        },10)
      
      }
    };
 
    if(tempSelection.width !== selection?.width || tempSelection.height !== selection?.height || tempSelection.x !== selection?.x || tempSelection.y !== selection?.y){
     callback();
    }

    return () => {
      if(selection) {
        tempSelection = selection;
    }
  }
      
  }, [ctx, selection]);

  const dimension = useMemo(()=>{

     if(selection){

    let { x, y, width, height } = selection;

   
         if(width <0){
        width += 4
        x-=2;
      }else{
        width -=4;
        x+=2;
      }

      if(height<0){
        height += 4
        y-=2;
      }else{
        height -=4;
        y+=2;
      }

      return { x, y, width, height };
    }

    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

  },[selection])

  const makeBlob = async(withBg?:boolean) => {
    if(!selection) return null;

    const {x,y,width,height} = dimension;

    const imgData = ctx?.getImageData(x, y, width, height);

        if (imgData) {

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = width;
          tempCanvas.height = height;

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");

          if(bgRef.current && context){
            const bgImg = bgRef.current.getContext("2d")?.getImageData(x, y, width, height);

            if(bgImg && withBg){
              context.putImageData(bgImg, 0, 0);
            }

            const stempCtx = tempCanvas.getContext("2d");
            if (stempCtx) {
              stempCtx.putImageData(imgData, 0, 0);
            }
            context.drawImage(tempCanvas,0,0);

            const blob:Blob = await new Promise((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                }
                
              });
            });

            return blob;
          }
          
        }
    return null;
  }

  const createDeleteMove = () => {
    if(!selection) return null;

    
    let { x, y, width, height } = selection;

   
         if(width <0){
        width += 4
        x-=2;
      }else{
        width -=4;
        x+=2;
      }

      if(height<0){
        height += 4
        y-=2;
      }else{
        height -=4;
        y+=2;
      }

      const move:Move = {
        ...DEFAULT_MOVE,
        rect: {
          width,
          height,
        },
        path: [[x, y]],
        options: {
          lineColor,
          lineWidth,
          shape: "rect",
          mode: "eraser",
          selection:{
            x:0,
            y:0,
            width:0,
            height:0
          },
          fillColor: "#000000",
        },
      };

      socket.emit("draw", move);
      
      return move;
  }

 const createCopy = async() => {
  const blob = await makeBlob(false);
  if (blob) {
    navigator.clipboard.write([
      new ClipboardItem({
        "image/png": Promise.resolve(blob),
      }),
    ]).then(() => {
      console.log("Image copied to clipboard");
    });
  }
 }

 useEffect(() => {
  const handleSelection = async(e:KeyboardEvent)=>{
    if(e.ctrlKey && e.key === "c" && selection) {
      createCopy();
    }
    if(e.key === "Delete" && selection){
      createDeleteMove();
    }
  }

  document.addEventListener("keydown", handleSelection)

  return () => {
    document.removeEventListener("keydown", handleSelection)
  }

 },[selection, ctx, bgRef,createCopy,createDeleteMove,makeBlob,lineColor,lineWidth])

useEffect(() => {
  const handleSelectionMove = async() => {
    if(selection){
      const blob = await makeBlob();
      if(!blob) return;

      const {x,y,height,width} = dimension;

      const reader  = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener("loadend",()=>{
        const base64data = reader.result?.toString();
        if(base64data){
          createDeleteMove()
          setMoveImage({
            base64: base64data,
            x:Math.min(x,x+width),
            y:Math.min(y,y+height),
            
          })
        }
      });
    }
  }

  if(selectionRef.current){
    const moveBtn = selectionRef.current[0]
    const copyBtn = selectionRef.current[1]
    const deleteBtn = selectionRef.current[2]

    moveBtn.addEventListener("click", handleSelectionMove);
    copyBtn.addEventListener("click", createCopy);
    deleteBtn.addEventListener("click", createDeleteMove);

    return () => {
      moveBtn.removeEventListener("click", handleSelectionMove);
      copyBtn.removeEventListener("click", createCopy);
      deleteBtn.removeEventListener("click", createDeleteMove);
    };
  }

  return ()=>{}
},[createDeleteMove, createCopy, dimension, makeBlob, selection, selectionRef, setMoveImage]);

};
