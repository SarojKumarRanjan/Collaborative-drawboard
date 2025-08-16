import { colorStore } from "@/store/Options.store";
import roomStore from "@/store/room.store";

const UserList = () => {

    const  users  = roomStore((state) => state.users);

  // dummy users data of map<string, string>
 
  const getColor = colorStore((state) => state.getColor);
 


    return (
        <div className="pointer-events-none absolute  z-20 flex gap-1 p-5 ">
        {/* User list content goes here */}
            <ul className="flex ">
                {[...users.keys()].map((user) => (
                    <li key={user} style={{
                        backgroundColor: getColor(user),
                        backgroundBlendMode: "multiply",
                        fontSize: "1rem",
                        width: "2rem",
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center"
                    }} className="  p-2  rounded-full shadow-md">
                        {users.get(user)?.split("")[0] || "A"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;