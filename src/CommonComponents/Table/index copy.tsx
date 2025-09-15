


// import React from "react";

// type Term = {
//   name: string; // e.g. "Term 1"
// };
// type TableProps = {
//   rows: string[];          // Row headers
//   terms: Term[];           // Terms
//   tasks?: string[][];      // Optional: task names per row/term
//   averages?: number[][];   // Optional: scores per row/term
// };
// const Table: React.FC<TableProps> = ({ rows, terms, tasks, averages }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-700">
//         <thead>
//           <tr>
//             <th
//               rowSpan={2}
//               className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
//             >
//               Assessment
//             </th>

//             {terms.map((term, idx) => (
//               <th
//                 key={idx}
//                 colSpan={2}
//                 className="border border-gray-300 px-4 py-2 text-center bg-gray-50"
//               >
//                 {term.name}
//               </th>
//             ))}
//           </tr>

//           <tr>
//             {terms.map((_, idx) => (
//               <React.Fragment key={idx}>
//                 <th className="border border-gray-300 px-4 py-2">Task</th>
//                 <th className="border border-gray-300 px-4 py-2">Avg</th>
//               </React.Fragment>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((row, rIdx) => (
//             <tr key={rIdx}>
//               <td className="border border-gray-300 px-4 py-2 bg-gray-50">{row}</td>

//               {terms.map((_, tIdx) => (
//                 <React.Fragment key={tIdx}>
//                   <td className="border border-gray-300 px-4 py-2 text-center">
//                     {tasks?.[rIdx]?.[tIdx] || ""}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">
//                     {averages?.[rIdx]?.[tIdx] ?? ""}
//                   </td>
//                 </React.Fragment>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;


// AssessmentTable.tsx
import React, { useRef, useState } from "react";
import { sanitizeText } from "../../utils/DescParagraph";

type Term = { name: string };

type AssessmentTableProps = {
  rows: string[];                       // row headers (one per row)
  terms: Term[];                        // terms for columns
  tasks?: (number | string)[][];       // shape: [rowIdx][termIdx]
  averages?: (string | number)[][];    // shape: [rowIdx][termIdx]
  descriptions?: string[];             // descriptive analysis per row
  prescriptives?: string[];            // prescriptive analysis per row
  maxScore?: number;
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
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    left: number;
    top: number;
    desc: string;
    pres: string;
  }>({ visible: false, left: 0, top: 0, desc: "", pres: "" });

  // Important: we accept the MouseEvent so we can compute target bounding rect
  const handleMouseEnter = (e: React.MouseEvent, rowIdx: number) => {
    const descRaw = descriptions?.[rowIdx] ?? "";
    const presRaw = prescriptives?.[rowIdx] ?? "";
    const desc = sanitizeText(descRaw) || "No descriptive analysis available.";
    const pres = sanitizeText(presRaw) || "No prescriptive analysis available.";

    const containerRect = containerRef.current?.getBoundingClientRect();
    const targetRect = (e.target as HTMLElement).closest("td")?.getBoundingClientRect();

    if (!targetRect) {
      // fallback: show tooltip near top-left of container
      const fallbackLeft = 8;
      const fallbackTop = 8;
      setTooltip({ visible: true, left: fallbackLeft, top: fallbackTop, desc, pres });
      console.debug("[AssessmentTable] tooltip fallback (no targetRect)");
      return;
    }

    let left = 0;
    let top = 0;
    if (containerRect) {
      const padding = 8;
      // try to position to the right of the cell
      left = targetRect.right - containerRect.left + padding;
      top = targetRect.top - containerRect.top;

      // clamp so tooltip doesn't overflow container
      const tooltipWidth = 320; // safe guess
      const maxLeft = Math.max(8, containerRect.width - tooltipWidth - 8);
      if (left > maxLeft) {
        // place to the left of the cell instead
        left = Math.max(8, targetRect.left - containerRect.left - tooltipWidth - padding);
      }

      // clamp top within container
      const maxTop = Math.max(8, containerRect.height - 120); // assume tooltip height ~120
      if (top > maxTop) top = maxTop;
      if (top < 8) top = 8;
    } else {
      // viewport fallback
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
                  const avgDisplay =
                    typeof avgVal === "number" || (typeof avgVal === "string" && avgVal !== "")
                      ? `${avgVal} / ${maxScore}`
                      : "";
                  return (
                    <React.Fragment key={tIdx}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{taskVal}</td>
                      <td
                        className="border border-gray-300 px-4 py-2 text-center cursor-default"
                        // pass the event so handler can compute bounding rect
                        onMouseEnter={(e) => handleMouseEnter(e, rIdx)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="inline-flex items-center gap-2 justify-center">
                          <span className="font-semibold">{avgDisplay}</span>
                          <span className="text-xs text-gray-400">(hover)</span>
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



