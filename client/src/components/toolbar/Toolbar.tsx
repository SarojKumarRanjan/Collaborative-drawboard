


import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import UserList from "./UserList";
import Eraser from "./Eraser";
import { FaUndo } from "react-icons/fa";



 const  Toolbar = ({undoRef}: {undoRef: React.RefObject<HTMLButtonElement>}) => {




    return(
        <div>
            <UserList />
            <div className="absolute top-40 left-4 z-50 flex flex-col gap-2  ">
                <button ref={undoRef} className="rounded-md bg-zinc-800 p-2 text-white">
                <FaUndo/>
                </button>
                <ColorPicker />
                <LineWidthPicker />
                <Eraser />
                
            </div>
        </div>
    )
}

export default Toolbar;