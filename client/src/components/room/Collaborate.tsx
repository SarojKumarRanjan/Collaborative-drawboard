/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState,  } from "react"
import { socket } from "@/lib/Socket"
import roomStore from '@/store/room.store';


const Collaborate = () => {

     const { roomid } = useParams<{ roomid?: string }>();
    const navigate = useNavigate()
    const setRoomId = roomStore((state) => state.setRoomId)

    const [joinRoom,setJoinRoom] = useState<string>()

    useEffect(() => {
        socket.on("created", (roomIdFromServer) => {
            setRoomId(roomIdFromServer)
            navigate(`/${roomIdFromServer}`)
        })

        socket.on("joined", (roomIdFromServer, failed) => {
            if (failed) {
                alert("Failed to join room")
                return
            }
            setRoomId(roomIdFromServer)
            navigate(`/${roomIdFromServer}`)
        })

        return () => {
            socket.off("created")
            socket.off("joined")
        }
    }, [ navigate, setRoomId ])

    console.log(roomid);

    const handleCreateroom = () => {
        socket.emit("create_room")
    }

    const handleJoinRoom = (e:any) => {
        e.preventDefault();
        socket.emit("join_room", joinRoom)
    }
    return (
        <div className="relative h-full w-full overflow-hidden">
            <button 
                className="absolute top-0 right-0 z-50 flex gap-5 bg-black text-white p-2 m-2" 
                onClick={handleCreateroom}
            >
                Create Room
            </button>
            <div className="absolute top-0 flex content-center z-100 bg-amber-400 p-4">
             <input
             value={joinRoom}
             onChange={(e) => setJoinRoom(e.target.value)}
             />
             <button 
             onClick={handleJoinRoom}
             >
                join room
             </button>

            </div>

           
        </div>
    )
   
}


export default Collaborate