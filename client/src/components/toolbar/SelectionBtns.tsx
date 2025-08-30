import useRefStore from "@/store/Refs.store";
import { optionStore } from "@/store/Options.store";
import { BsArrowsMove } from "react-icons/bs";
import { AiFillCopy, AiOutlineDelete } from "react-icons/ai";


const SelectionBtns = () => {

    const selection = optionStore((state) => (
        state.selection
    ))
    const selectionRef = useRefStore((state) => state.selectionRef);

    let top;
    let left;

    if(selection){
        const { x, y, width, height } = selection;

       top = Math.min(y, y + height) - 50;
       left = Math.min(x, x + width);

    }else{
        left = -40
        top = -40;
    }


    return(
        <div className="absolute top-0 left-0 z-100 flex items-center justify-center gap-2 pointer-events-auto "
        style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
        >

            <button className="rounded-full bg-gray-20 p-2 pointer-events-auto"
            ref={(ref) => {
                if(ref && selectionRef.current) {
                    selectionRef.current[0] = ref;
                }
            }}
            >
            <BsArrowsMove/>
            </button>
             <button className="rounded-full bg-gray-20 p-2 pointer-events-auto"
            ref={(ref) => {
                if(ref && selectionRef.current) {
                    selectionRef.current[1] = ref;
                }
            }}
            >
            <AiFillCopy/>
            </button>
             <button className="rounded-full bg-gray-20 p-2 pointer-events-auto"
            ref={(ref) => {
                if(ref && selectionRef.current) {
                    selectionRef.current[2] = ref;
                }
            }}
            >
            <AiOutlineDelete/>
            </button>

        </div>
    )




}



export default SelectionBtns;