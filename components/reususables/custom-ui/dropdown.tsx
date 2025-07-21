// components/StatusDropdown.tsx
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full md:w-48" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none"
      >
        {selected}
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md">
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
