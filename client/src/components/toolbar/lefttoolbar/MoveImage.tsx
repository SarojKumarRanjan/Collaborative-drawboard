
import useRefStore from "@/store/Refs.store";
import { useMotionValue } from "motion/react";
import { useBoardPosition } from "@/store/BoardPosition";
import { getPosition } from "@/lib/GetPosition";
import { socket } from "@/lib/Socket";
import {motion} from "motion/react";

const Moveimage = () => {

    const canvasRef = useRefStore((state) => state.canvasRef);
    const MoveImage = useRefStore((state) => state.moveImage);
    const setMoveImage = useRefStore((state) => state.setMoveImage);
    const {x,y} = useBoardPosition();
    const imageX = useMotionValue(50)
    const imageY = useMotionValue(50)

    const handleImageMove = () => {

        const [finalX, finalY] = [getPosition(imageX.get(),x), getPosition(imageY.get(),y)];
 

        
    const move:Move = {
        width: 0,
        height: 0,
        radius:0,
        path:[[finalX, finalY]],
        options:{
            lineWidth: 1,
            lineColor:"#000",
            erase: false,
            shape: "image",
        },
        timestamp: Date.now(),
        eraser: false,
        base64: MoveImage,
    }
 
 
    socket.emit("draw", move);
    setMoveImage("");
    imageX.set(50);
    imageY.set(50);
    }

    if(!MoveImage) return null;

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
            <button className="w-full text-center text-black " onClick={handleImageMove}>
                Accept
            </button>
            <img className="pointer-events-none" src={MoveImage} alt="Image to place" />
        </motion.div>
    );
}

export default Moveimage;
