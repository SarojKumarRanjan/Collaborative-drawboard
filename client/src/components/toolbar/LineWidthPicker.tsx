import { optionStore } from "@/store/Options.store";
import { useState, useRef } from "react";
import { useClickAway } from "react-use";

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
        className="p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        Line Width Picker
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-md">
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
