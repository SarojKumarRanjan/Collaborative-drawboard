import { optionStore } from "@/store/Options.store";
import Sketch from '@uiw/react-color-sketch';
import { useState } from "react";

const ColorPicker = () => {


const { setLineColor,lineColor } = optionStore.getState();

const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                Color Picker
            </button>
            {isOpen && (
                <div >
                    <Sketch
                        color={lineColor}
                        onChange={(color) => setLineColor(color.hex)}
                    />
                </div>
            )}
        </div>
    );
}


export default ColorPicker;