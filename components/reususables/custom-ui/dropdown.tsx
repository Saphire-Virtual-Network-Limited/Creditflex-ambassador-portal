// components/StatusDropdown.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";


export const StatusDropdown = ({
    optionArray,
    selected,
    onChange,
}: {
    optionArray: string[];
    selected: string;
    onChange: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block w-48">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
      >
        {selected}
        <ChevronDown className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute z-10  w-full bg-white border border-gray-300 rounded-md shadow-md">
          {optionArray.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
