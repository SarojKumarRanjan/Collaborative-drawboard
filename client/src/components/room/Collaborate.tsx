/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState,  } from "react"
import { socket } from "@/lib/Socket"
import roomStore from '@/store/room.store';

//function to return random four letter string
const randomFourLetterString = () => {
    return Math.random().toString(36).substring(2, 6);
}


const Collaborate = () => {

     const { roomid } = useParams<{ roomid?: string }>();
    const navigate = useNavigate()
    const setRoomId = roomStore((state) => state.setRoomId)

    const [joinRoom,setJoinRoom] = useState<string>()

    useEffect(() => {
       const handleCreate =  (roomIdFromServer:string) => {
            setRoomId(roomIdFromServer)
            navigate(`/${roomIdFromServer}`)
        }

        const handleJoined =  (roomIdFromServer:string, failed:boolean) => {
            if (failed) {
                alert("Failed to join room")
                return
            }
            setRoomId(roomIdFromServer)
            navigate(`/${roomIdFromServer}`)
        }
        socket.on("created", handleCreate)
        socket.on("joined", handleJoined)

        return () => {
            socket.off("created", handleCreate)
            socket.off("joined", handleJoined)
        }
    }, [ navigate, setRoomId ])

    console.log(roomid);

    const handleCreateroom = () => {
        socket.emit("create_room", randomFourLetterString())
    }

    const handleJoinRoom = (e: any) => {
        e.preventDefault();
        socket.emit("join_room", joinRoom, randomFourLetterString())
    }
    return (
        <div className=" h-full w-full overflow-hidden">
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