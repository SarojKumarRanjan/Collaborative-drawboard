import { useUsersStore } from "@/store/Users";
import SocketMouse from "./room/SocketMouse";


const MouseRenderer = () => {

const {userIds} = useUsersStore()

const users = userIds();



return (
    <>
    {
        users.map((userId) => {
       


            return (
                <SocketMouse userId={userId} key={userId}/>
            )
        })
    }
    </>
)


}


export default MouseRenderer;