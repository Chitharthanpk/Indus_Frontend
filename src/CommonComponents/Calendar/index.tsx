// import React, { useState } from "react";

// interface CalendarProps {
//   highlightedDates?: { [key: number]: string }; // e.g., {7: "red", 19: "blue"}
//   onDateClick?: (day: number) => void;
// }

// const Calendar: React.FC<CalendarProps> = ({ highlightedDates = {}, onDateClick }) => {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   // Get month details
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

//   // Weekday headers
//   const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const goToPrevMonth = () => {
//     setCurrentDate(new Date(year, month - 1, 1));
//   };

//   const goToNextMonth = () => {
//     setCurrentDate(new Date(year, month + 1, 1));
//   };

//   // Create empty slots before the 1st day
//   const blanks = Array(firstDay).fill(null);

//   // Generate day cells
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-2">
//         <button
//           onClick={goToPrevMonth}
//           className="p-1 text-gray-200 hover:text-white"
//         >
//           {"<"}
//         </button>
//         <h3 className="text-sm font-medium text-white">
//           {currentDate.toLocaleString("default", { month: "long" })} {year}
//         </h3>
//         <button
//           onClick={goToNextMonth}
//           className="p-1 text-gray-200 hover:text-white"
//         >
//           {">"}
//         </button>
//       </div>

//       {/* Weekday names */}
//       <div className="grid grid-cols-7 text-xs text-gray-200 mb-2">
//         {weekdays.map((day) => (
//           <span key={day}>{day}</span>
//         ))}
//       </div>

//       {/* Days grid */}
//       <div className="grid grid-cols-7 gap-2 text-sm">
//         {blanks.map((_, i) => (
//           <div key={`blank-${i}`} className="w-8 h-8"></div>
//         ))}
//         {daysArray.map((day) => {
//           const highlightColor = highlightedDates[day];
//           return (
//             <div
//               key={day}
//               onClick={() => onDateClick?.(day)}
//               className={`flex justify-center items-center w-8 h-8 rounded-full cursor-pointer
//                 ${
//                   highlightColor
//                     ? highlightColor === "red"
//                       ? "bg-red-400 text-white"
//                       : "bg-blue-100"
//                     : "hover:bg-gray-200"
//                 }
//               `}
//             >
//               {day}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Calendar;

import React, { useState } from "react";

interface CalendarProps {
  highlightedDates?: { [key: number]: string }; // e.g., {7: "red", 19: "blue"}
  onDateClick?: (isoDate: string) => void; // now returns full YYYY-MM-DD
}

const Calendar: React.FC<CalendarProps> = ({ highlightedDates = {}, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get month details
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Weekday headers
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Create empty slots before the 1st day
  const blanks = Array(firstDay).fill(null);

  // Generate day cells
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={goToPrevMonth}
          className="p-1 text-gray-200 hover:text-white"
        >
          {"<"}
        </button>
        <h3 className="text-sm font-medium text-white">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 text-gray-200 hover:text-white"
        >
          {">"}
        </button>
      </div>

      {/* Weekday names */}
      <div className="grid grid-cols-7 text-xs text-gray-200 mb-2">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="w-8 h-8"></div>
        ))}
        {daysArray.map((day) => {
          const highlightColor = highlightedDates[day];
          return (
            <div
              key={day}
              onClick={() => {
                const isoDate = new Date(year, month, day)
                  .toISOString()
                  .split("T")[0];
                onDateClick?.(isoDate);
              }}
              className={`flex justify-center items-center w-8 h-8 rounded-full cursor-pointer
                ${
                  highlightColor
                    ? highlightColor === "red"
                      ? "bg-red-400 text-white"
                      : "bg-blue-100"
                    : "hover:bg-gray-200"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

