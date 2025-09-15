// // src/components/AssessmentTable.tsx
// import React, { useRef, useState } from "react";
// import { sanitizeText } from "../../utils/DescParagraph";

// type Term = { name: string };

// type AssessmentTableProps = {
//   rows: string[];
//   terms: Term[];
//   tasks?: (number | string)[][];
//   averages?: (string | number)[][];
//   descriptions?: string[];    // descriptive per row
//   prescriptives?: string[];   // prescriptive per row
//   maxScore?: number;
// };

// const AssessmentTable: React.FC<AssessmentTableProps> = ({
//   rows,
//   terms,
//   tasks,
//   averages,
//   descriptions,
//   prescriptives,
//   maxScore = 10,
// }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [tooltip, setTooltip] = useState<{ visible: boolean; left: number; top: number; desc: string; pres: string }>(
//     { visible: false, left: 0, top: 0, desc: "", pres: "" }
//   );

//   const handleMouseEnter = (e: React.MouseEvent, rowIdx: number) => {
//     const descRaw = descriptions?.[rowIdx] ?? "";
//     const presRaw = prescriptives?.[rowIdx] ?? "";
//     const desc = sanitizeText(descRaw) || "No descriptive analysis available.";
//     const pres = sanitizeText(presRaw) || "No prescriptive analysis available.";

//     const containerRect = containerRef.current?.getBoundingClientRect();
//     const targetTd = (e.target as HTMLElement).closest("td");
//     const targetRect = targetTd?.getBoundingClientRect();

//     if (!targetRect) {
//       setTooltip({ visible: true, left: 8, top: 8, desc, pres });
//       return;
//     }

//     let left = 0;
//     let top = 0;
//     if (containerRect) {
//       const padding = 8;
//       left = targetRect.right - containerRect.left + padding;
//       top = targetRect.top - containerRect.top;

//       const tooltipWidth = 320;
//       const maxLeft = Math.max(8, containerRect.width - tooltipWidth - 8);
//       if (left > maxLeft) left = Math.max(8, targetRect.left - containerRect.left - tooltipWidth - padding);

//       const tooltipHeightGuess = 160;
//       const maxTop = Math.max(8, containerRect.height - tooltipHeightGuess - 8);
//       if (top > maxTop) top = maxTop;
//       if (top < 8) top = 8;
//     } else {
//       left = targetRect.right + 8;
//       top = targetRect.top;
//     }

//     setTooltip({ visible: true, left, top, desc, pres });
//   };

//   const handleMouseLeave = () => setTooltip({ visible: false, left: 0, top: 0, desc: "", pres: "" });

//   return (
//     <div className="relative" ref={containerRef}>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-700">
//           <thead>
//             <tr>
//               <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
//                 Assessment
//               </th>
//               {terms.map((term, idx) => (
//                 <th key={idx} colSpan={2} className="border border-gray-300 px-4 py-2 text-center bg-gray-50">
//                   {term.name}
//                 </th>
//               ))}
//             </tr>
//             <tr>
//               {terms.map((_, idx) => (
//                 <React.Fragment key={idx}>
//                   <th className="border border-gray-300 px-4 py-2">Task</th>
//                   <th className="border border-gray-300 px-4 py-2">Avg</th>
//                 </React.Fragment>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row, rIdx) => (
//               <tr key={rIdx}>
//                 <td className="border border-gray-300 px-4 py-2 bg-gray-50">{row}</td>

//                 {terms.map((_, tIdx) => {
//                   const taskVal = tasks?.[rIdx]?.[tIdx] ?? "";
//                   const avgVal = averages?.[rIdx]?.[tIdx];
//                   const avgDisplay =
//                     typeof avgVal === "number" || (typeof avgVal === "string" && avgVal !== "")
//                       ? `${avgVal} / ${maxScore}`
//                       : "";
//                   return (
//                     <React.Fragment key={tIdx}>
//                       <td className="border border-gray-300 px-4 py-2 text-center">{taskVal}</td>
//                       <td
//                         className="border border-gray-300 px-4 py-2 text-center cursor-default"
//                         onMouseEnter={(e) => handleMouseEnter(e, rIdx)}
//                         onMouseLeave={handleMouseLeave}
//                       >
//                         <div className="inline-flex items-center gap-2 justify-center cursor-pointer">
//                           <span className="font-semibold">{avgDisplay}</span>
//                         </div>
//                       </td>
//                     </React.Fragment>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {tooltip.visible && (
//         <div
//           className="absolute z-50 w-80 max-w-sm rounded-lg shadow-lg bg-white border p-3 text-xs pointer-events-none"
//           style={{ left: tooltip.left, top: tooltip.top }}
//           role="dialog"
//           aria-label="Analysis tooltip"
//         >
//           <div className="font-semibold text-sm">Descriptive Analysis</div>
//           <div className="text-gray-700 leading-relaxed text-xs mb-2">{tooltip.desc}</div>
//           <div className="font-semibold text-sm">Prescriptive Analysis</div>
//           <div className="text-gray-700 leading-relaxed text-xs">{tooltip.pres}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssessmentTable;


// src/components/AssessmentTable.tsx
import React, { useRef, useState } from "react";
import { sanitizeText } from "../../utils/DescParagraph";

type Term = { name: string };

type AssessmentTableProps = {
  rows: string[];
  terms: Term[];
  tasks?: (number | string)[][];
  averages?: (string | number)[][];
  descriptions?: string[];    // descriptive per row
  prescriptives?: string[];   // prescriptive per row
  maxScore?: number | number[]; // <-- accept single number OR array of numbers (per-row)
};

const AssessmentTable: React.FC<AssessmentTableProps> = ({
  rows,
  terms,
  tasks,
  averages,
  descriptions,
  prescriptives,
  maxScore = 10,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; left: number; top: number; desc: string; pres: string }>(
    { visible: false, left: 0, top: 0, desc: "", pres: "" }
  );

  const handleMouseEnter = (e: React.MouseEvent, rowIdx: number) => {
    const descRaw = descriptions?.[rowIdx] ?? "";
    const presRaw = prescriptives?.[rowIdx] ?? "";
    const desc = sanitizeText(descRaw) || "No descriptive analysis available.";
    const pres = sanitizeText(presRaw) || "No prescriptive analysis available.";

    const containerRect = containerRef.current?.getBoundingClientRect();
    const targetTd = (e.target as HTMLElement).closest("td");
    const targetRect = targetTd?.getBoundingClientRect();

    if (!targetRect) {
      setTooltip({ visible: true, left: 8, top: 8, desc, pres });
      return;
    }

    let left = 0;
    let top = 0;
    if (containerRect) {
      const padding = 8;
      left = targetRect.right - containerRect.left + padding;
      top = targetRect.top - containerRect.top;

      const tooltipWidth = 320;
      const maxLeft = Math.max(8, containerRect.width - tooltipWidth - 8);
      if (left > maxLeft) left = Math.max(8, targetRect.left - containerRect.left - tooltipWidth - padding);

      const tooltipHeightGuess = 160;
      const maxTop = Math.max(8, containerRect.height - tooltipHeightGuess - 8);
      if (top > maxTop) top = maxTop;
      if (top < 8) top = 8;
    } else {
      left = targetRect.right + 8;
      top = targetRect.top;
    }

    setTooltip({ visible: true, left, top, desc, pres });
  };

  const handleMouseLeave = () => setTooltip({ visible: false, left: 0, top: 0, desc: "", pres: "" });

  return (
    <div className="relative" ref={containerRef}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-700">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
                Assessment
              </th>
              {terms.map((term, idx) => (
                <th key={idx} colSpan={2} className="border border-gray-300 px-4 py-2 text-center bg-gray-50">
                  {term.name}
                </th>
              ))}
            </tr>
            <tr>
              {terms.map((_, idx) => (
                <React.Fragment key={idx}>
                  <th className="border border-gray-300 px-4 py-2">Task</th>
                  <th className="border border-gray-300 px-4 py-2">Avg</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="border border-gray-300 px-4 py-2 bg-gray-50">{row}</td>

                {terms.map((_, tIdx) => {
                  const taskVal = tasks?.[rIdx]?.[tIdx] ?? "";
                  const avgVal = averages?.[rIdx]?.[tIdx];

                  // pick per-row max if an array was passed, otherwise use the single number
                  const rowMax = Array.isArray(maxScore) ? (maxScore[rIdx] ?? 10) : maxScore;

                  const avgDisplay =
                    typeof avgVal === "number" || (typeof avgVal === "string" && avgVal !== "")
                      ? `${avgVal} / ${rowMax}`
                      : "";
                  return (
                    <React.Fragment key={tIdx}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{taskVal}</td>
                      <td
                        className="border border-gray-300 px-4 py-2 text-center cursor-default"
                        onMouseEnter={(e) => handleMouseEnter(e, rIdx)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="inline-flex items-center gap-2 justify-center cursor-pointer">
                          <span className="font-semibold">{avgDisplay}</span>
                        </div>
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tooltip.visible && (
        <div
          className="absolute z-50 w-80 max-w-sm rounded-lg shadow-lg bg-white border p-3 text-xs pointer-events-none"
          style={{ left: tooltip.left, top: tooltip.top }}
          role="dialog"
          aria-label="Analysis tooltip"
        >
          <div className="font-semibold text-sm">Descriptive Analysis</div>
          <div className="text-gray-700 leading-relaxed text-xs mb-2">{tooltip.desc}</div>
          <div className="font-semibold text-sm">Prescriptive Analysis</div>
          <div className="text-gray-700 leading-relaxed text-xs">{tooltip.pres}</div>
        </div>
      )}
    </div>
  );
};

export default AssessmentTable;

