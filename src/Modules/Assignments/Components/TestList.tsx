import Table, { type Column } from "../Container/Table";

type TestResult = {
  id: string;
  testTaken: string;
  marks: number;
  feedback: string;
};

const columns: Column<TestResult>[] = [
  { key: "testTaken", label: "Test Taken" },
  {
    key: "marks",
    // Use a non-breaking space so the header won't wrap to two lines
    label: "Marks\u00A0Obtained",
    align: "right",
    // Provide a sensible min-width and alignment for header & cell
    className: "w-20 min-w-[56px] text-right",
    // Render with an inline-block to make sure the number stays on one line
    render: (row) => <span className="inline-block min-w-[56px]">{row.marks}</span>,
  },
  { key: "feedback", label: "Feedback" },
];

const testResults: TestResult[] = [
  {
    id: "t1",
    testTaken: "Midterm Exam",
    marks: 85,
    feedback:
      "You have performed well, showing strong conceptual understanding. Keep practicing problem-solving to further strengthen your accuracy and improve your time management in longer assessments.",
  },
  {
    id: "t2",
    testTaken: "Weekly Quiz 1",
    marks: 72,
    feedback:
      "Good effort! You have a fair understanding but need to revise fundamental concepts. Focus on weaker areas and practice regularly to increase consistency and accuracy in your responses.",
  },
  {
    id: "t3",
    testTaken: "Unit Test 2",
    marks: 91,
    feedback:
      "Excellent work! Your answers reflect deep comprehension and clarity. Continue maintaining this standard and explore more advanced practice questions to challenge yourself further.",
  },
  {
    id: "t4",
    testTaken: "Final Assessment",
    marks: 65,
    feedback:
      "Your performance indicates effort but with some gaps in clarity. Revise core topics, seek clarification on doubts, and practice mock tests to build stronger confidence and improve marks steadily.",
  },
];

export default function TestList() {
  return (
    <Table
      columns={columns}
      data={testResults}
      headerBg="bg-indigo-200"
      rowBg="#eef2ff"
      rowAltBg="#f8fafc"
      hoverBg="hover:bg-indigo-50"
    />
  );
}
