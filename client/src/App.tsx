import ModalManager from "./components/portal/Modalmanger";
import { useUsersStore } from "./store/Users";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";


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
   <Outlet/>
    <ModalManager />
    
    {/* This div is used for React portals, such as modals */}
   <div id="portal">

   </div>
   
   </>
  )
}

export default App
