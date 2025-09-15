import React from "react";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderColor?: string;
  focusColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  errorMessage?: string;
  className?: string;
};

export default function TextInput({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  borderColor = "border-gray-300",
  focusColor = "focus:border-blue-500 focus:ring-blue-500",
  textColor = "text-black",
  size = "md",
  errorMessage,
  className = "",
}: TextInputProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm sm:text-base",
    md: "px-3 py-2 text-sm sm:text-base md:text-lg",
    lg: "px-4 py-3 text-base sm:text-lg md:text-xl",
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="font-medium text-xs sm:text-sm md:text-base">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-lg border ${borderColor} ${focusColor} ${textColor} ${sizeClasses[size]} outline-none ${className}`}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs sm:text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
