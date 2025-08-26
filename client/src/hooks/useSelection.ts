import { optionStore } from "@/store/Options.store";
import useRefStore from "@/store/Refs.store";
import { useCtx } from "./useCtx";
import { useEffect } from "react";
import { socket } from "@/lib/Socket";

export const useSelection = (drawAllMoves: () =>Promise<void>) => {
    const selection = optionStore((state) => state.selection);
    const {lineColor,lineWidth} = optionStore((state) => state);
    const ctx = useCtx();
    const bgRef = useRefStore((state) => state.bgRef);

    useEffect(() => {

      const callback = async() => {

              await  drawAllMoves();
        if (ctx && selection) {
            const { x, y, width, height } = selection;
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000";
            ctx.setLineDash([5, 10]);
            ctx.globalCompositeOperation = "destination-over";

            ctx.beginPath()
            ctx.rect(x, y, width, height);
            ctx.stroke();
            ctx.closePath();
            ctx.setLineDash([]);
        }


      }
  
       callback()


    }, [ctx, selection]);


    useEffect(() =>{

        if(!selection) return;
        const { x, y, width, height } = selection;
         const handleCopySelection = (e:KeyboardEvent) =>{
            if(e.ctrlKey && e.key === "c"){
                
                const imgData = ctx?.getImageData(x, y, width, height);

                if(imgData){
                   const canvas = document.createElement("canvas");
                   canvas.width = width;
                   canvas.height = height;
                   const context = canvas.getContext("2d");
                   if (context) {
                       context.putImageData(imgData, 0, 0);
                       canvas.toBlob((blob) => {
                           if (blob) {
                               navigator.clipboard.write([
                                   new ClipboardItem({
                                       "image/png": Promise.resolve(blob)
                                   })
                               ])
                           }
                       });
                   }
                }


            }

            if(e.key === "Delete" && selection){
                const move:Move = {
                    circle:{
                        cX:0,
                        cY:0,
                        radiusX:0,
                        radiusY:0
                    },
                    rect:{
                        fill:true,
                        width,
                        height
                    },
                    path:[[x,y]],
                    options:{
                         lineColor,
                         lineWidth,
                         shape:"rect",
                         mode:"eraser",
                         selection

                    },
                    id:"",
                    img:{
                        base64:""
                    },
                    timestamp:0
                }

                  socket.emit("draw", move);

            }
         }


         window.addEventListener('keydown', handleCopySelection);

         return () => {
             window.removeEventListener('keydown', handleCopySelection);
         };
    },[ctx, selection,bgRef,lineColor,lineWidth]);

}