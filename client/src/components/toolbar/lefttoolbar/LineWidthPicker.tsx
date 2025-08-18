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
        className="text-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdOutlineMenu  />
        
      </button>
      {isOpen && (
        <div className="absolute left-14 top-0 w-48 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Line Width: <span className="font-bold">{lineWidth}</span>
          </label>
          <input
            className={`w-full ${lineColor}  cursor-pointer`}
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
