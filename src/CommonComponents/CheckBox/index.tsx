import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="
          w-5 h-5 rounded border border-gray-400 
          appearance-none cursor-pointer
          checked:bg-[#53825e] checked:border-[#53825e]
        "
      />
      {label}
    </label>
  );
};

export default Checkbox;
