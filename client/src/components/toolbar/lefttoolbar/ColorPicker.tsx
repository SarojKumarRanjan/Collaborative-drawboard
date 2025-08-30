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
const setFillColor = optionStore((state) => state.setFillColor);
const fillColor = optionStore((state) => state.fillColor);
const mode = optionStore((state) => state.mode);

const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            
            ref={ref}
            className="relative">
            <button
                disabled={mode !== "draw"}
                className=" "
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoColorPalette className="text-xl" />
            </button>
            {isOpen && (
                <div  className="absolute bottom-1  flex  gap-4 left-15 bg-white border border-gray-300 rounded ">
                    <div>
                        <p className="p-1 font-semibold">Stroke Color</p>
                        <Sketch
                            title="Stroke Color"
                            color={lineColor}
                            onChange={(color) => setLineColor(color.hex)}
                        />
                    </div>

                    <div>
                        <p className="p-1 font-semibold">Fill Color</p>
                        <Sketch
                            title="Fill Color"
                            color={fillColor}
                            onChange={(color) => setFillColor(color.hex)}
                        />
                    </div>
                    
                </div>
            )}
        </div>
    );
}


export default ColorPicker;