import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import UserList from "../UserList";
import Eraser from "./Eraser";
import { FaRedo, FaUndo } from "react-icons/fa";
import Collaborate from "@/components/room/Collaborate";
import refStore from "@/store/Refs.store";
import { CANVAS_SIZE } from "@/constant";
import { HiOutlineDownload } from "react-icons/hi";
import ImageInput from "./ImageInput";
import useSavedMovesStore from "@/store/SavedMoves.store";
import roomStore from "@/store/room.store";

const Toolbar = () => {

  const undoRef = refStore((state) => state.undoRef);
  const canvasRef = refStore((state) => state.canvasRef);
  const bgRef = refStore((state) => state.bgRef);
  const redoRef = refStore((state) => state.redoRef);

  const myMoves = roomStore((state) => state.myMoves);
  const savedMoves = useSavedMovesStore((state) => state.savedMoves);

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;
    const ctx = canvas.getContext("2d");
    if (ctx && canvasRef.current && bgRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0);
      ctx.drawImage(bgRef.current, 0, 0);
      
    }

    const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
  };

  const baseBtn =
    " flex items-center p-2 justify-center rounded-md hover:bg-gray-300  transition";

  return (
    <div>
      
      <UserList />

      
      <div className="absolute top-40 left-4 z-50 flex flex-col gap-1 bg-zinc-400/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-200">
        
        
        <div className={baseBtn}>
          <Collaborate />
        </div>

        <div className={baseBtn}> 
        <div className="flex items-center  justify-center">
          <button
            ref={undoRef}
            className="p-2"
            disabled={myMoves.length === 0}
          >
            <FaUndo size={18} />
          </button>
        </div>
        </div>
        <div className={baseBtn}> 
        <div className="flex items-center  justify-center">
          <button
            ref={redoRef}
            className="p-2"
            disabled={savedMoves.length === 0}
          >
            <FaRedo size={18} />
          </button>
        </div>
        </div>
       

       
        <div className={baseBtn}>
          <div className=" flex items-center justify-center">
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
            <ImageInput />
          </div>
        </div>

        
        <div className={baseBtn}>
          <div className=" flex items-center justify-center">
            <Eraser />
          </div>
        </div>
        <div className={baseBtn}> 
        <div className="flex items-center  justify-center  rounded ">
          <button
            onClick={handleDownload}
            className=""
          >
            <HiOutlineDownload size={18} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
