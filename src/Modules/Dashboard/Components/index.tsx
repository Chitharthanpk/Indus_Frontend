import React, { useState } from "react";
import Card from "../../../CommonComponents/Card";
import Progress from "../../../CommonComponents/ProgressiveBar";
import Tabs from "../../../CommonComponents/Tab";
import DashboardCalendar from "../../../CommonComponents/DashboardCalendar";

interface Subject {
  name: string;
  code: string;
  quiz: number;
  assignment: number;
  overall: number;
}

const DashboardComponents: React.FC = () => {
  const [subjects] = useState<Subject[]>([
    { name: "Mathematics", code: "MATH101", quiz: 60, assignment: 40, overall: 50 },
    { name: "Science", code: "SCI102", quiz: 80, assignment: 70, overall: 75 },
    { name: "English", code: "ENG103", quiz: 50, assignment: 30, overall: 40 },
    { name: "History", code: "HIS104", quiz: 70, assignment: 60, overall: 65 },
    { name: "Computer Science", code: "CSE105", quiz: 90, assignment: 85, overall: 88 },
    { name: "Economics", code: "ECO106", quiz: 55, assignment: 45, overall: 50 },
  ]);

  // Track active metric for each subject (default: "overall")
  const [activeMetric, setActiveMetric] = useState<{ [key: string]: "quiz" | "assignment" | "overall" }>(
    () =>
      subjects.reduce((acc, subj) => {
        acc[subj.code] = "overall";
        return acc;
      }, {} as { [key: string]: "quiz" | "assignment" | "overall" })
  );

  return (
    <div className="p-6 bg-[#f9fafb] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 Student Dashboard</h1>

      {/* Course Overview with Checkboxes & Progress */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6 mb-6">
        {subjects.map((subj) => {
          const value = subj[activeMetric[subj.code]];

          return (
            <Card key={subj.code} className="flex-1 min-w-[280px]">
              <h2 className="text-lg font-semibold mb-2">
                {subj.name} ({subj.code})
              </h2>

              {/* Dynamic Checkboxes */}
              <div className="flex gap-4 mb-4">
                {(["quiz", "assignment", "overall"] as const).map((metric) => (
         <label className="flex items-center gap-2 text-sm cursor-pointer">
  <div className="relative w-4 h-4 flex-shrink-0">
    <input
      type="checkbox"
      checked={activeMetric[subj.code] === metric}
      onChange={() =>
        setActiveMetric((prev) => ({
          ...prev,
          [subj.code]: metric,
        }))
      }
      className="
        peer w-4 h-4 rounded border border-gray-400 appearance-none cursor-pointer
        checked:bg-[#53825e] checked:border-[#53825e]
      "
    />
    {/* White tick centered */}
    <svg
      aria-hidden="true"
      className="
        pointer-events-none absolute left-1/2 top-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-3 h-3 opacity-0 peer-checked:opacity-100 text-white
      "
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
  <span>{metric.charAt(0).toUpperCase() + metric.slice(1)}</span>
</label>


                ))}
              </div>

              {/* Progress Bar */}
              <Progress value={value} />
              <p className="text-sm text-gray-500 mt-2">{value}% complete</p>
            </Card>
          );
        })}
      </div>

      {/* Task Overview */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">📌 Task Overview</h2>
        <Tabs
          defaultTab="upcoming"
          tabs={[
            { id: "upcoming", label: "Upcoming", content: <p>No upcoming tasks 🎉</p> },
            { id: "pending", label: "Pending", content: <p>2 assignments waiting...</p> },
            { id: "submitted", label: "Submitted", content: <p>All good! ✅</p> },
            { id: "overdue", label: "Overdue", content: <p>1 overdue quiz ⚠️</p> },
          ]}
        />
      </Card>

      {/* Calendar */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">📅 Calendar</h2>
        <DashboardCalendar currentMonth={new Date()} />
      </Card>
    </div>
  );
};

export default DashboardComponents;
