// import React from "react";
// import type { Column } from "../Container/Table";
// import Table from "../Container/Table";

// // --- Types ---
// export type Assignment = {
//   id: string;
//   taskName: string;
//   issueDate: string;
//   dueDate: string;
//   feedback?: string;
//   status: "submitted" | "not submitted" | "due date exceed";
// };

// // --- Helpers ---
// const formatToDDMMYYYY = (value: string | Date) => {
//   const d = typeof value === "string" ? new Date(value) : value;
//   if (Number.isNaN(d.getTime())) return "--";
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const truncateWords = (text: string, limit = 30) => {
//   if (!text) return "";
//   const words = text.trim().split(/\s+/);
//   if (words.length <= limit) return text;
//   return words.slice(0, limit).join(" ") + "…";
// };

// // --- Sample data (10 rows, feedback only for submitted) ---
// const assignments: Assignment[] = [
//   {
//     id: "a1",
//     taskName: "Math: Quadratic Equations",
//     issueDate: "2025-09-01",
//     dueDate: "2025-09-10",
//     feedback: "Good work on the method — show more steps for full marks.",
//     status: "submitted",
//   },
//   {
//     id: "a2",
//     taskName: "History: Independence Movements",
//     issueDate: "2025-09-02",
//     dueDate: "2025-09-12",
//     status: "not submitted",
//   },
//   {
//     id: "a3",
//     taskName: "Computer Science: React Project",
//     issueDate: "2025-08-20",
//     dueDate: "2025-08-30",
//     status: "due date exceed",
//   },
//   {
//     id: "a4",
//     taskName: "Biology: Plant Cells Lab",
//     issueDate: "2025-09-03",
//     dueDate: "2025-09-15",
//     feedback: "Excellent diagrams and clear observations.",
//     status: "submitted",
//   },
//   {
//     id: "a5",
//     taskName: "English: Shakespeare Essay",
//     issueDate: "2025-09-04",
//     dueDate: "2025-09-14",
//     feedback: "Strong analysis with good quotations; clarify the conclusion.",
//     status: "submitted",
//   },
//   {
//     id: "a6",
//     taskName: "Physics: Motion Assignment",
//     issueDate: "2025-09-05",
//     dueDate: "2025-09-16",
//     status: "not submitted",
//   },
//   {
//     id: "a7",
//     taskName: "Chemistry: Organic Compounds",
//     issueDate: "2025-08-22",
//     dueDate: "2025-09-01",
//     status: "due date exceed",
//   },
//   {
//     id: "a8",
//     taskName: "Economics: Market Structures",
//     issueDate: "2025-09-06",
//     dueDate: "2025-09-18",
//     feedback: "Well-structured essay, but add real-world examples.",
//     status: "submitted",
//   },
//   {
//     id: "a9",
//     taskName: "Geography: Climate Change Report",
//     issueDate: "2025-09-07",
//     dueDate: "2025-09-19",
//     feedback: "Good coverage; add more data sources for stronger support.",
//     status: "submitted",
//   },
//   {
//     id: "a10",
//     taskName: "Art: Impressionist Painting",
//     issueDate: "2025-09-08",
//     dueDate: "2025-09-20",
//     status: "not submitted",
//   },
// ];

// // --- Columns ---
// const columns: Column<Assignment>[] = [
//   {
//     key: "taskName",
//     label: "Task Name",
//     width: "w-72",
//     render: (row) => <span className="font-medium">{row.taskName}</span>,
//   },
//   {
//     key: "issueDate",
//     label: "Issue Date",
//     width: "w-32",
//     align: "center",
//     render: (row) => <span>{formatToDDMMYYYY(row.issueDate)}</span>,
//   },
//   {
//     key: "dueDate",
//     label: "Due Date",
//     width: "w-32",
//     align: "center",
//     render: (row) => <span>{formatToDDMMYYYY(row.dueDate)}</span>,
//   },
//   {
//     key: "feedback",
//     label: "Feedback",
//     render: (row) => {
//       if (row.status !== "submitted" || !row.feedback) return <span className="text-gray-400 italic">—</span>;
//       return <span title={row.feedback}>{truncateWords(row.feedback, 30)}</span>;
//     },
//   },
//   {
//     key: "status",
//     label: "Status",
//     width: "w-36",
//     align: "center",
//     render: (row) => {
//       const status = row.status;
//       const map: Record<string, string> = {
//         submitted: "bg-green-100 text-green-800",
//         "not submitted": "bg-yellow-100 text-yellow-800",
//         "due date exceed": "bg-red-100 text-red-800",
//       };
//       return (
//         <span className={`inline-block px-3 py-1 text-xs rounded-2xl font-semibold ${map[status]}`}>
//           {status}
//         </span>
//       );
//     },
//   },
// ];

// // --- Component ---
// export default function AssignmentsTable() {
//   const handleRowClick = (row: Assignment) => {
//     console.log("row clicked", row.id);
//   };

//   // Debug log to ensure data length at runtime
//   console.log("assignments length:", assignments.length);

//   return (
//     <div className="p-4">
//         <div className="flex justify-center">
//       <h2 className="w-fit text-md  font-semibold text-black px-6 py-2 mb-4  rounded-md bg-[#a5bdd2]">
//           Tasks
//         </h2>
//         </div>

//     <div className="mt-4">

//       <Table
//         columns={columns}
//         data={assignments}
//         rowKey={(r) => r.id}
//         headerBg="bg-slate-900 text-white"
//         rowBg="#ffffff"
//         rowAltBg="#f8fafc"
//         hoverBg="bg-slate-50"
//         onRowClick={handleRowClick}
//         className="border"
//       />
//       </div>

//       {/* Extra debug: render a simple list below the table so you can visually confirm all rows */}
     
//     </div>
//   );
// }

import React, { useRef, useState } from "react";
import type { Column } from "../Container/Table";
import Table from "../Container/Table";

// --- Types ---
export type Assignment = {
  id: string;
  taskName: string;
  issueDate: string;
  dueDate: string;
  // initial/instructor feedback can remain here, but student modal input won't be stored
  feedback?: string;
  status: "submitted" | "not submitted" | "due date exceed";
};

// --- Helpers ---
const formatToDDMMYYYY = (value: string | Date) => {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "--";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const truncateWords = (text: string, limit = 30) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "…";
};

const countWords = (text = "") => (text.trim() === "" ? 0 : text.trim().split(/\s+/).length);

// --- Initial sample data (10 rows) ---
const initialAssignments: Assignment[] = [
  { id: "a1", taskName: "Math: Quadratic Equations", issueDate: "2025-09-01", dueDate: "2025-09-10", feedback: "Good work on the method — show more steps for full marks.", status: "submitted" },
  { id: "a2", taskName: "History: Independence Movements", issueDate: "2025-09-02", dueDate: "2025-09-12", status: "not submitted" },
  { id: "a3", taskName: "Computer Science: React Project", issueDate: "2025-08-20", dueDate: "2025-08-30", status: "due date exceed" },
  { id: "a4", taskName: "Biology: Plant Cells Lab", issueDate: "2025-09-03", dueDate: "2025-09-15", feedback: "Excellent diagrams and clear observations.", status: "submitted" },
  { id: "a5", taskName: "English: Shakespeare Essay", issueDate: "2025-09-04", dueDate: "2025-09-14", feedback: "Strong analysis with good quotations; clarify the conclusion.", status: "submitted" },
  { id: "a6", taskName: "Physics: Motion Assignment", issueDate: "2025-09-05", dueDate: "2025-09-16", status: "not submitted" },
  { id: "a7", taskName: "Chemistry: Organic Compounds", issueDate: "2025-08-22", dueDate: "2025-09-01", status: "due date exceed" },
  { id: "a8", taskName: "Economics: Market Structures", issueDate: "2025-09-06", dueDate: "2025-09-18", feedback: "Well-structured essay, but add real-world examples.", status: "submitted" },
  { id: "a9", taskName: "Geography: Climate Change Report", issueDate: "2025-09-07", dueDate: "2025-09-19", feedback: "Good coverage; add more data sources for stronger support.", status: "submitted" },
  { id: "a10", taskName: "Art: Impressionist Painting", issueDate: "2025-09-08", dueDate: "2025-09-20", status: "not submitted" },
];

// --- Component ---
export default function AssignmentsTable() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);

  // modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  // modal-only (private) states: do NOT persist these into `assignments`
  const [taskText, setTaskText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openModal = (row: Assignment) => {
    setSelected(row);
    // clear modal-only values when opening
    setTaskText("");
    setSelectedFile(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setTaskText("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
  };

  const onFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setSelectedFile(f);
    else setSelectedFile(null);
  };

  const submit = () => {
    if (!selected) return;

    // require either task text or file
    if (taskText.trim().length === 0 && !selectedFile) {
      alert("Please provide task details or attach a file before submitting.");
      return;
    }

    // IMPORTANT: do NOT store taskText or file into the table.
    // Only update status to 'submitted' so the table reflects submission,
    // but keep the table's feedback field unchanged.
    setAssignments((prev) => prev.map((a) => (a.id === selected.id ? { ...a, status: "submitted" } : a)));

    // close modal and clear modal-only states
    closeModal();
  };

  const handleRowClick = (row: Assignment) => {
    if (row.status === "not submitted" || row.status === "due date exceed") {
      openModal(row);
    } else {
      alert("This assignment is already submitted.");
    }
  };

  // --- Columns ---
  const columns: Column<Assignment>[] = [
    {
      key: "taskName",
      label: "Task Name",
      width: "w-72",
      render: (row) => <span className="font-medium">{row.taskName}</span>,
    },
    {
      key: "issueDate",
      label: "Issue Date",
      width: "w-32",
      align: "center",
      render: (row) => <span>{formatToDDMMYYYY(row.issueDate)}</span>,
    },
    {
      key: "dueDate",
      label: "Due Date",
      width: "w-32",
      align: "center",
      render: (row) => <span>{formatToDDMMYYYY(row.dueDate)}</span>,
    },
    {
      key: "feedback",
      label: "Feedback",
      render: (row) => {
        // show only existing instructor feedback (from initial data),
        // do NOT display modal-submitted text because we didn't save it.
        if (row.status !== "submitted" || !row.feedback) return <span className="text-gray-400 italic">—</span>;
        return <span title={row.feedback}>{truncateWords(row.feedback, 30)}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      width: "w-36",
      align: "center",
      render: (row) => {
        const map: Record<string, string> = {
          submitted: "bg-green-100 text-green-800",
          "not submitted": "bg-yellow-100 text-yellow-800",
          "due date exceed": "bg-red-100 text-red-800",
        };
        return (
          <span className={`inline-block px-3 py-1 text-xs rounded-2xl font-semibold ${map[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <h2 className="w-fit text-md  font-semibold text-black px-6 py-2 mb-4  rounded-md bg-[#a5bdd2]">Tasks</h2>
      </div>

      <div className="mt-4">
        <Table
          columns={columns}
          data={assignments}
          rowKey={(r) => r.id}
          headerBg="bg-slate-900 text-white"
          rowBg="#ffffff"
          rowAltBg="#f8fafc"
          hoverBg="bg-slate-50"
          onRowClick={(row) => handleRowClick(row)}
          className="border"
        />
      </div>

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* modal box */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Submit: {selected.taskName}</h3>

            <label className="block text-sm font-medium text-gray-700">Task Area </label>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm"
              placeholder="Enter your task details"
            />
            <div className="text-xs text-gray-500 mt-1">{taskText.length} characters</div>

            <label className="block mt-4 text-sm font-medium text-gray-700">Attach file</label>

            {/* hidden file input + styled button */}
            <input ref={fileInputRef} type="file" onChange={onFileChange} className="hidden" />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onFileButtonClick}
                className="px-3 py-2 rounded-md bg-gray-100 border hover:bg-gray-200 text-sm"
              >
                Upload file
              </button>
              <span className="text-sm text-gray-700">{selectedFile ? selectedFile.name : "No file selected"}</span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeModal} className="px-3 py-1 rounded-md border">
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!(taskText.trim().length > 0 || selectedFile)}
                className={`px-3 py-1 rounded-md text-white ${taskText.trim().length > 0 || selectedFile ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      
    
    </div>
  );
}



