import { socket } from "@/lib/Socket";
import { useEffect, useState } from "react"
import SocketMouse from "./room/SocketMouse";


const MouseRenderer = () => {

const [mouses , setMouses] = useState<string[]>([]);

useEffect(()=>{
    socket.on("user_in_room",(socketIds) => {

        const allUsers = socketIds.filter((socketId:string) => socketId !== socket.id)
        setMouses(allUsers);
    })

    return () => {
        socket.off("user_in_room")
    }
},[])


return (
    <>
    {
        mouses.map((socket) => {
       


            return (
                <SocketMouse socketId={socket} key={socket}/>
            )
        })
    }
    </>
)


}


export default MouseRenderer;