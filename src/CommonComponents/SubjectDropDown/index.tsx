import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-fit mx-auto" ref={dropdownRef}>
      {/* Selected / default */}
      <div
        className="w-fit px-4 py-2 rounded-md font-semibold cursor-pointer bg-gradient-to-r from-[#4193df] via-[#57a1e7] to-[#7fbef4] text-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || placeholder || "Select"}
        <span className={`ml-2 text-xs transform transition-transform ${isOpen ? "rotate-180" : ""}`}>&#9660;</span>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <ul className="absolute mt-1 w-fit bg-[#d6e7d7] rounded-md shadow-lg overflow-hidden z-10">
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-9 py-2 cursor-pointer mb-1 last:mb-0 text-xs
                ${selected === option ? "bg-[#53825e] text-white" : "text-black hover:bg-[#53825e] hover:text-white"}`}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
