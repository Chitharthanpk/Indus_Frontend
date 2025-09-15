import React from "react";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  borderColor?: string;
  focusColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  errorMessage?: string;
  placeholder?:string
};

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  borderColor = "border-gray-300",
  focusColor = "focus:border-blue-500 focus:ring-blue-500",
  textColor = "text-black",
  size = "md",
  errorMessage,
  placeholder
}: DropdownProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-2 py-1 text-base",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-medium text-sm">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`rounded-lg border ${borderColor} ${focusColor} ${textColor} ${sizeClasses[size]} outline-none`}
      >
        <option value="">{placeholder?placeholder:"select..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}