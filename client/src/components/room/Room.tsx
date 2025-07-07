import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"
import Toolbar from "../Toolbar"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, type FormEvent } from "react"
import { socket } from "@/lib/Socket"

const Room = () => {
    const { roomid } = useParams<{ roomid?: string }>();
    const navigate = useNavigate()

    useEffect(() => {
        socket.on("created", (roomIdFromServer) => {
            navigate(`/${roomIdFromServer}`)
        })

        socket.on("joined", (roomIdFromServer, failed) => {
            if (failed) {
                alert("Failed to join room")
                return
            }
            navigate(`/${roomIdFromServer}`)
        })

        return () => {
            socket.off("created")
            socket.off("joined")
        }
    }, [roomid, navigate])

    console.log(roomid);

    const handleCreateroom = () => {
        socket.emit("create_room")
    }

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("join_room", roomid)
    }

    return (
        <div className="relative h-full w-full overflow-hidden">
            <button 
                className="absolute top-0 right-0 z-50 flex gap-5 bg-black text-white p-2 m-2" 
                onClick={handleCreateroom}
            >
                Create Room
            </button>

            <Toolbar />
            <CanvasPage />
            <MousePosition />
            <MouseRenderer />
        </div>
    )
}

export default Room;