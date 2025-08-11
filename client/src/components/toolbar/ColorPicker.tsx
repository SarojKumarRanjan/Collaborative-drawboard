import { optionStore } from "@/store/Options.store";
import Sketch from '@uiw/react-color-sketch';
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { IoColorPalette } from "react-icons/io5";

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
                className="p-2 bg-gray-400 rounded hover:bg-gray-300 "
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoColorPalette className="text-xl" />
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