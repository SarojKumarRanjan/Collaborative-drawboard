import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import UserList from "./UserList";
import Eraser from "./Eraser";
import { FaUndo } from "react-icons/fa";
import Collaborate from "@/components/room/Collaborate";

const Toolbar = ({ undoRef }: { undoRef: React.RefObject<HTMLButtonElement> }) => {
  const baseBtn =
    "w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition";

  return (
    <div>
      
      <UserList />

      
      <div className="absolute top-40 left-4 z-50 flex flex-col gap-3 bg-zinc-400/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-200">
        
        
        <div className={baseBtn}>
          <Collaborate />
        </div>

       
        <div className={baseBtn}> 
        <div className="flex items-center  justify-center bg-gray-400 rounded hover:bg-gray-300">
          <button
            ref={undoRef}
            className="p-2"
          >
            <FaUndo size={18} />
          </button>
        </div>
        </div>
       

       
        <div className={baseBtn}>
          <div className="w-full h-full flex items-center justify-center">
            <ColorPicker />
          </div>
        </div>

       
        <div className={baseBtn}>
          <div className="w-full h-full flex items-center justify-center">
            <LineWidthPicker />
          </div>
        </div>

        
        <div className={baseBtn}>
          <div className="w-full h-full flex items-center justify-center">
            <Eraser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
