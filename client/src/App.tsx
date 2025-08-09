import ModalManager from "./components/portal/Modalmanger";
import { Outlet } from "react-router-dom";
import { useInitUser } from "./hooks/Users.hook";

function App() {
  
 /**
  * This hook initializes the user state by listening to socket events.
  */
useInitUser();


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
