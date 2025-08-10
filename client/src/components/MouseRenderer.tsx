import UsersMouse from "./room/UsersMouse";
import roomStore from "@/store/room.store";
import { socket } from "@/lib/Socket";

const MouseRenderer = () => {
    const { users,usersMoves } = roomStore((state) => state);

    //debugging user cursor positions
    // in the map

    return (
        <>
            {[...usersMoves?.keys() ?? []].map((userId) => {
                if (userId === socket.id) return null;
                return (
                    <UsersMouse userId={userId} key={userId} username={users.get(userId)|| "demo"} />
                );
            })}
        </>
    );
};

export default MouseRenderer;
