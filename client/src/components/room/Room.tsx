import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"
import Toolbar from "../Toolbar"


const Room = () => {

    return(
        <div className="relative h-full w-full overflow-hidden">
            <Toolbar/>
            
            <CanvasPage/>
            <MousePosition/>
            <MouseRenderer/>

        </div>
    )
}

export default Room;