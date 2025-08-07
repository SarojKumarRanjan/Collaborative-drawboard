import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"
import Toolbar from "../Toolbar"
import Collaborate from "./Collaborate"
import NotFound from "../notFound"
import { useModalStore } from '@/store/Modal.store';

const Room = () => {

    const {openModal} = useModalStore();

    //we will open the modal upon error on joined room
    // when user try to join the the room and error occurs 

    return (
        <div className="relative h-full w-full overflow-hidden">
           
            
            <Collaborate />
             <Toolbar /> 
            <CanvasPage />
            
            <MousePosition />
            <MouseRenderer />
        </div>
    )
}

export default Room;