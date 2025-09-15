
// src/Modules/SubjectSummary/SubjectSummary.tsx
import React from "react";
import IndividualSubject from "./Components/IndividualSubject";

interface SubjectSummaryProps {
  leftExpanded: boolean;
  rightExpanded: boolean;
  toggleLeft?: () => void;
  toggleRight?: () => void;
}

const SubjectSummary: React.FC<SubjectSummaryProps> = ({
  leftExpanded,
  rightExpanded,
 
}) => {
  // Decide numeric flex value; tweak numbers to taste
  const flexValue = leftExpanded ? 0.8 : rightExpanded ? 0.6 : 1;

  return (
    <div className="min-h-screen bg-gray-50 relative flex">
      {/* The wrapper controls how much horizontal space this column gets */}
      <div
        className="space-y-6 transition-all duration-200 ease-in-out"
        style={{ flex: flexValue }}
      >
        {/* forward the states/toggles to the child */}
        <IndividualSubject
          leftExpanded={leftExpanded}
          rightExpanded={rightExpanded}
       
        />
      </div>
    </div>
  );
};

export default SubjectSummary;





