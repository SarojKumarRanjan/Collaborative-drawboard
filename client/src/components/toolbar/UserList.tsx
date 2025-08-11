import roomStore from "@/store/room.store";

const UserList = () => {

    //const { users } = roomStore((state) => state);

  // dummy users data of map<string, string>


  const users = new Map<string, string>([
      ["user1", "Alice"],
      ["user2", "Bob"],
      ["user3", "Charlie"],
      ["user4", "David"]
  ]);

    return (
        <div className="pointer-events-none absolute  z-10 flex gap-1 p-5 ">
        {/* User list content goes here */}
            <ul className="flex ">
                {[...users.keys()].map((user) => (
                    <li key={user} className="bg-gray-400 p-2  rounded-full shadow-md">
                        {users.get(user)?.split("")[0] || "A"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;