import { optionStore } from "@/store/Options.store";
import { FaEraser } from "react-icons/fa";

const Eraser = () => {
  
const erase = optionStore((state) => state.erase);
const setErase = optionStore((state) => state.setErase);
  return (
    <div className=" bg-gray-400 rounded hover:bg-gray-300">
    <button
      className={` p-2 text-xl ${erase ? 'active' : ''} `}
      onClick={() => setErase(!erase)}
      title="Eraser"
    >
      <FaEraser/>
    </button>
    
  </div>
  );
}


export default Eraser;