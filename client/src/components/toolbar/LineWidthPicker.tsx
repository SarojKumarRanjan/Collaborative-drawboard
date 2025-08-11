import { optionStore } from "@/store/Options.store";
import { useState, useRef } from "react";
import { useClickAway } from "react-use";
import { MdOutlineMenu } from "react-icons/md";

const LineWidthPicker = () => {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => setIsOpen(false));

  const lineWidth = optionStore((state) => state.lineWidth);
  const setLineWidth = optionStore((state) => state.setLineWidth);
  const lineColor = optionStore((state) => state.lineColor);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={ref} className="relative">
      <button
        className="p-2 bg-gray-400 rounded hover:bg-gray-300 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdOutlineMenu className="text-xl" />
        
      </button>
      {isOpen && (
        <div className="absolute w-50 z-10 bg-white border border-gray-300 rounded shadow-md">
          <input
            className="w-full p-2 border-b-2"
            style={{ accentColor: lineColor }}

            type="range"
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
          />
        </div>
      )}
    </div>
  );
};

export default LineWidthPicker;
