import CanvasPage from "../canvas/Canvas"
import MousePosition from "../MousePosition"
import MouseRenderer from "../MouseRenderer"


const Room = () => {

    return(
        <div className="relative h-full w-full overflow-hidden">
            <CanvasPage/>
            <MousePosition/>
            <MouseRenderer/>

        </div>
    )
}

export default Room;