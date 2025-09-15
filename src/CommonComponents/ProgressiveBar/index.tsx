import React from "react";

type ProgressProps = {
  value: number;
};

const Progress: React.FC<ProgressProps> = ({ value }) => {
  const getColor = (val: number) => {
    if (val < 35) return "bg-red-500"; 
    if (val < 50) return "bg-yellow-500"; 
    if (val < 75) return "bg-blue-500"; 
    return "bg-[#53825e]"; 
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all ${getColor(value)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
