import Room from "@/components/room/Room"
import { useUsersStore } from "./store/Users";
import { useEffect } from "react";


function App() {
  
 
  const initializeSocketListeners = useUsersStore(state => state.initializeSocketListeners);
 const users = useUsersStore((state) => state.userIds) 

 console.log(users)
  useEffect(() => {
    const cleanup = initializeSocketListeners();
    return cleanup;
  }, [initializeSocketListeners]);



  return (
   <>
   <Room/>
   </>
  )
}

export default App
