import { socket } from "@/lib/Socket"
import { useBoardPosition } from "@/store/BoardPosition"
import { useEffect, useState } from "react";
import {motion} from "motion/react"
import {BsCursorFill} from "react-icons/bs"



const SocketMouse = ({socketId}:{socketId:string}) =>{
    const boardPosition = useBoardPosition();

    const [x,setX] = useState(boardPosition.x.get());
    const [y,setY] = useState(boardPosition.y.get());

    const [position , setPosition] = useState({x:1,y:1});

    useEffect(() =>{

        socket.on("mouse_moved" , (newX , newY , socketIdMoved) => {
            if(socketIdMoved === socketId){
                setPosition({x:newX,y:newY});
            }

        });


      

        return () => {
            socket.off("mouse_moved", )
        }


    },[socketId])



    useEffect(() =>{
    const unsubscribe = boardPosition.x.onChange(setX);
    return unsubscribe;
},[boardPosition.x])

  useEffect(() =>{
    const unsubscribe = boardPosition.y.onChange(setY);
    return unsubscribe;
},[boardPosition.y])


return(
    <motion.div
    className={`absolute top-0 left-0 text-blue-800 ${position.x===-1 && "hidden"}`}
    animate={
        {x:position.x+x,y:position.y+y}
    }
    transition={{
        duration:0.3,ease:"linear"
    }}
    >
    <BsCursorFill className="-rotate-90"/>

    </motion.div>
)

}







export default SocketMouse