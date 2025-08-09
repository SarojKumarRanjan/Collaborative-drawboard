import { optionStore } from "@/store/Options.store";
import Sketch from '@uiw/react-color-sketch';
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

const ColorPicker = () => {

    const ref = useRef<HTMLDivElement>(null);
    useClickAway(ref, () => setIsOpen(false));


const lineColor = optionStore((state) => state.lineColor);
    const setLineColor = optionStore((state) => state.setLineColor);

const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            ref={ref}
            className="relative">
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