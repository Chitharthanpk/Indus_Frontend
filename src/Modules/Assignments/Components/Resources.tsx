import React, { useMemo, useState } from "react";
import { FileText, FileArchive, Link as LinkIcon } from "lucide-react";

type FileType = "pdf" | "ppt" | "link";

interface Resource {
  fileName: string;
  issueDate: string; // YYYY-MM-DD
  fileType: FileType;
  fileUrl: string;
}

// Static resources (edit these as needed)
const RESOURCES: Resource[] = [
  { fileName: "Algebra Notes - Chapter 1", issueDate: "2024-09-01", fileType: "pdf", fileUrl: "https://example.com/algebra-ch1.pdf" },
  { fileName: "Calculus Practice Problems", issueDate: "2024-10-05", fileType: "pdf", fileUrl: "https://example.com/calculus-practice.pdf" },

  // PPT examples (these will appear under PPT)
  { fileName: "Physics Lecture Slides - Week 1", issueDate: "2024-08-12", fileType: "ppt", fileUrl: "https://example.com/physics-week1.pptx" },
  { fileName: "Chemistry Intro Slides", issueDate: "2024-07-10", fileType: "ppt", fileUrl: "https://example.com/chem-intro.pptx" },

  // Link examples (these will appear under Links)
  { fileName: "Khan Academy — Algebra", issueDate: "2024-06-01", fileType: "link", fileUrl: "https://khanacademy.org/algebra" },
  { fileName: "Interactive Graphing Tool", issueDate: "2024-05-18", fileType: "link", fileUrl: "https://desmos.com" },
];

const ResourceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FileType>("pdf");

  // Group once and reuse
  const grouped = useMemo(() => {
    return {
      pdf: RESOURCES.filter((r) => r.fileType === "pdf"),
      ppt: RESOURCES.filter((r) => r.fileType === "ppt"),
      link: RESOURCES.filter((r) => r.fileType === "link"),
    } as const;
  }, []);

  const tabs: { key: FileType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "pdf", label: "PDF Files", icon: <FileText size={16} />, count: grouped.pdf.length },
    { key: "ppt", label: "PPT Files", icon: <FileArchive size={16} />, count: grouped.ppt.length },
    { key: "link", label: "Links", icon: <LinkIcon size={16} />, count: grouped.link.length },
  ];

  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="text-red-500" size={22} />;
      case "ppt":
        return <FileArchive className="text-orange-500" size={22} />;
      case "link":
        return <LinkIcon className="text-green-500" size={22} />;
    }
  };

  const currentResources = grouped[activeTab];

  return (
    <div className="h-full w-full flex flex-col p-6 bg-[#f9f9f9] rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-[#2f5233] mb-6 border-b pb-2">Resources</h2>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.key
                  ? "text-[#2f5233] border-b-2 border-[#2f5233] bg-[#f4f9f6]"
                  : "text-gray-600 hover:text-[#2f5233] hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resource list */}
      <div className="flex flex-col gap-4">
        {currentResources.length > 0 ? (
          currentResources.map((r, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:bg-[#f4f9f6] transition-colors">
              <div className="flex items-center gap-3">
                {getFileIcon(r.fileType)}
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-md font-medium text-[#2f5233] hover:underline">
                  {r.fileName}
                </a>
              </div>
              <span className="text-sm text-gray-500">{r.issueDate}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">{getFileIcon(activeTab)}</div>
            <p className="text-gray-500">No {activeTab.toUpperCase()} files found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceList;
