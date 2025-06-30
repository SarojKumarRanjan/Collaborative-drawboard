import { useUsersStore } from "@/store/Users";
import UsersMouse from "./room/UsersMouse";


const MouseRenderer = () => {

const {userIds} = useUsersStore()

const users = userIds();



return (
    <>
    {
        users.map((userId) => {
       


            return (
                <UsersMouse userId={userId} key={userId}/>
            )
        })
    }
    </>
)


}


export default MouseRenderer;