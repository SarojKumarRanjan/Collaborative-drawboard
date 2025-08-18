import { optionStore } from "@/store/Options.store";
import { FaEraser } from "react-icons/fa";

const Eraser = () => {
  
const erase = optionStore((state) => state.erase);
const setErase = optionStore((state) => state.setErase);
  return (
    <div className=" ">
    <button
      className={` text-xl ${erase ? 'active' : ''} `}
      onClick={() => setErase(!erase)}
      title="Eraser"
    >
      <FaEraser/>
    </button>
    
  </div>
  );
}


export default Eraser;