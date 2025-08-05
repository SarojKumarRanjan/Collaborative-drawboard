import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"
import Toolbar from "../Toolbar"
import Collaborate from "./Collaborate"

const Room = () => {



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