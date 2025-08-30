import { optionStore } from "@/store/Options.store";
import { FaRegCircle   } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { CgShapeZigzag } from "react-icons/cg";
import ModePicker from "./ModePicker";

const TopToolBar = () => {

    const shapes = [
        {
            name: "Line",
            value: "line",
            icon: <CgShapeZigzag />
        },
        {
            name: "Rect",
            value: "rect",
            icon: <BiRectangle />
        },
        {
            name: "Circle",
            value: "circle",
            icon: <FaRegCircle />
        }
    ]

    const setShape = optionStore((state) => state.setShape);
    const currentShape = optionStore((state) => state.shape);

    

    const handleShapeChange = (shape: Shape) => {
       
        setShape(shape);
    };

    return (
        <div className={`flex absolute z-20 top-5 left-180 gap-4  items-center justify-between p-2 bg-zinc-400 border-b border-gray-300 rounded-md`}>
            {
                shapes.map((shape) => (
                    <button   key={shape.value} onClick={() => handleShapeChange(shape.value as Shape)} className={` ${shape.value === currentShape ? 'bg-gray-200' : ''} p-2   rounded-md`}>
                        {shape.icon}
                    </button>
                ))
            }
            <ModePicker />
        </div>
    );
}

export default TopToolBar;
