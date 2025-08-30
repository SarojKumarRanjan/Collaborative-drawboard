
import useRefStore from "@/store/Refs.store";
import { useMotionValue } from "motion/react";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { socket } from "@/lib/Socket";
import {motion} from "motion/react";
import { optionStore } from "@/store/Options.store";
import { DEFAULT_MOVE } from "@/constant";
import { useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";

const Moveimage = () => {

    const canvasRef = useRefStore((state) => state.canvasRef);
    const MoveImage = useRefStore((state) => state.moveImage);
    const setMoveImage = useRefStore((state) => state.setMoveImage);
    const selection = optionStore((state) => state.selection);
    const {x,y} = useBoardPosition();
    const imageX = useMotionValue(MoveImage.x ?? 50)
    const imageY = useMotionValue(MoveImage.y ?? 50)


    useEffect(() => {

        if(MoveImage.x){
            imageX.set(MoveImage.x);
        }else{
            imageX.set(50);
        }
       
    }, [imageX, MoveImage.x]);

    useEffect(() => {

        if(MoveImage.y){
            imageY.set(MoveImage.y);
        }else{
            imageY.set(50);
        }

    }, [imageY, MoveImage.y]);


    const handleImageMove = () => {

        const [finalX, finalY] = [getPosition(imageX.get(),x), getPosition(imageY.get(),y)];
 

        
    const move:Move = {
        ...DEFAULT_MOVE,
        img:{
            base64:MoveImage.base64
        },
        path:[[finalX, finalY]],
        options:{
            ...DEFAULT_MOVE.options,
            shape:"image",
            selection:selection
        },
        
    }
 
 
    socket.emit("draw", move);
    setMoveImage({base64:""});
    imageX.set(50);
    imageY.set(50);
    }

    if(!MoveImage.base64) return null;

    return (
        <motion.div 
        drag
        dragConstraints={canvasRef}
        dragElastic={0.2}
        dragTransition={{power:0.03,timeConstant:50}}
        className="absolute z-20 cursor-grab"
        style={{
            x: imageX,
            y: imageY
        }}
        >
           <div className="absolute bottom-full mb-2 flex gap-3">
            <button className="rounded-full bg-gray-200 p-2" onClick={handleImageMove}>
              <AiOutlineCheck/>
            </button>
            <button className="rounded-full bg-gray-200 p-2" onClick={() => setMoveImage({base64:""})}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

            </button>

           </div>
            <img className="pointer-events-none" src={MoveImage.base64} alt="Image to place" />
        </motion.div>
    );
}

export default Moveimage;
