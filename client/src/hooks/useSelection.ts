import { optionStore } from "@/store/Options.store";
import { useCtx } from "./useCtx";
import { useEffect } from "react";

export const useSelection = (drawAllMoves: () => void) => {
    const selection = optionStore((state) => state.selection);
    const ctx = useCtx();

    useEffect(() => {
        drawAllMoves();
        if (ctx && selection) {
            const { x, y, width, height } = selection;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 10]);
            ctx.globalCompositeOperation = "destination-over";

            ctx.beginPath()
            ctx.rect(x-2, y-2, width+4, height+4);
            ctx.stroke();
            ctx.closePath();
            ctx.setLineDash([]);
        }
    }, [ctx, selection]);


    useEffect(() =>{
         const handleCopySelection = (e:KeyboardEvent) =>{
            if(e.ctrlKey && e.key === "c" && selection){
                const { x, y, width, height } = selection;
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
         }


         window.addEventListener('keydown', handleCopySelection);

         return () => {
             window.removeEventListener('keydown', handleCopySelection);
         };
    },[ctx, selection])

}