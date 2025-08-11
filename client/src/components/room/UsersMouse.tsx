import { socket } from "@/lib/Socket"
import { useBoardPosition } from "@/store/BoardPosition"
import { useEffect, useState } from "react";
import {motion} from "motion/react"
import {BsCursorFill} from "react-icons/bs"
import { getRandomColor } from "@/lib/GetNextColor";
import { colorStore } from "@/store/Options.store";



const UsersMouse = ({userId,username}:{userId:string,username:string}) =>{
    const boardPosition = useBoardPosition();
    const setColor = colorStore((state) => state.setColor);
    const getColor = colorStore((state) => state.getColor);

    const [x,setX] = useState(boardPosition.x.get());
    const [y,setY] = useState(boardPosition.y.get());

    const [position , setPosition] = useState({x:1,y:1});


    useEffect(() => {
        
        setColor(userId, getRandomColor());
    }, [userId, setColor]);

    useEffect(() =>{

        socket.on("mouse_moved" , (newX , newY , socketIdMoved) => {
            if(socketIdMoved === userId){
                setPosition({x:newX,y:newY});
            }

        });


      

        return () => {
            socket.off("mouse_moved", )
        }


    },[userId])



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
    style={{
        color: getColor(userId),
    }}
    className={`absolute top-0 left-0 text-blue-800 ${position.x===-1 && "hidden"} pointer-events-none`}
    animate={
        {x:position.x+x,y:position.y+y}
    }
    transition={{
        duration:0.1,ease:"linear"
    }}
    >
    <BsCursorFill className="-rotate-90"/>
    <p>{username}</p>

    </motion.div>
)

}







export default UsersMouse