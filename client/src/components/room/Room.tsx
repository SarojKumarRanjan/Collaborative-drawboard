import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"
import Moveimage from "../toolbar/lefttoolbar/MoveImage"
//import NotFound from "../notFound"
//import { useModalStore } from '@/store/Modal.store';
import Toolbar from "@/components/toolbar/lefttoolbar/Toolbar";

import Chat from "../chat/Chat"
import TopToolBar from "@/components/toolbar/toptoolbar/Toptoolbar";

const Room = () => {

    //const {openModal} = useModalStore();

    

 

    //we will open the modal upon error on joined room
    // when user try to join the the room and error occurs 

    return (
        <div className="h-svh w-svw  overflow-hidden">

            <TopToolBar />
            <Moveimage/>
            <Toolbar  />
            
            <CanvasPage  />
            
            
            <MousePosition />
            <MouseRenderer />
            <Chat/>
        </div>
    )
}

export default Room;