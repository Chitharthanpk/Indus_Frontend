import React from "react";

type CalendarProps = {
  currentMonth: Date;
};

const DashboardCalendar: React.FC<CalendarProps> = ({ currentMonth }) => {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const days = [];
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(i);
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {currentMonth.toLocaleString("default", { month: "long" })}{" "}
        {currentMonth.getFullYear()}
      </h3>
      <div className="grid grid-cols-7 text-center text-gray-500 font-medium">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2 text-center">
        {Array(start.getDay())
          .fill(null)
          .map((_, idx) => (
            <div key={idx}></div>
          ))}
        {days.map((d) => (
          <div
            key={d}
            className="p-2 rounded-lg hover:bg-[#53825e] hover:text-white cursor-pointer"
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCalendar;
