import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"

import NotFound from "../notFound"
import { useModalStore } from '@/store/Modal.store';
import Toolbar from "@/components/toolbar/lefttoolbar/Toolbar";
import { useRef } from "react"
import Chat from "../chat/Chat"
import TopToolBar from "@/components/toolbar/toptoolbar/Toptoolbar";

const Room = () => {

    const {openModal} = useModalStore();

    const undoRef = useRef<HTMLButtonElement>(null);

    //we will open the modal upon error on joined room
    // when user try to join the the room and error occurs 

    return (
        <div className="h-svh w-svw  overflow-hidden">

            <TopToolBar />

            <Toolbar undoRef={undoRef} />
            <CanvasPage undoRef={undoRef} />
            
            
            <MousePosition />
            <MouseRenderer />
            <Chat/>
        </div>
    )
}

export default Room;