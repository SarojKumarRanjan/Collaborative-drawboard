import { optionStore } from "@/store/Options.store";
import { AiOutlineSelect } from "react-icons/ai";
import { BsPenFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";

const ModePicker = () => {
    const setMode = optionStore((state) => state.setMode);
    const mode = optionStore((state) => state.mode);
    return (
        <div className="flex p-2 gap-4">
            <button className={`text-xl ${mode==="draw" && "bg-green-400" } `} onClick={() => setMode("draw")}>
                <BsPenFill/>
            </button>
            <button className={`text-xl ${mode==="eraser" && "bg-green-400" } `} onClick={() => setMode("eraser")}>
                 <FaEraser/>
            </button>
            <button className={`text-xl ${mode==="select" && "bg-green-400" } `} onClick={() => setMode("select")}>
                <AiOutlineSelect/>
            </button>
        </div>
    );
}

export default ModePicker;