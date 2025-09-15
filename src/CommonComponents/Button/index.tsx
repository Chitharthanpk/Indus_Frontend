import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  disabled?: boolean; 
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  size = "md",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs sm:text-sm w-full",
    md: "px-4 py-2 text-sm sm:text-base w-full",
    lg: "px-6 py-3 text-base sm:text-lg w-full",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-medium ${bgColor} ${textColor} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
