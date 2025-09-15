import { useEffect, useState } from "react";
import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const SubjectList: React.FC = () => {
  const enrollmentid = Cookies.get("enrollmentId");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `https://sfhuaftz5k.execute-api.ap-south-1.amazonaws.com/dev/api/enrollments/${enrollmentid}`
        );

        let parsedSubjects: any = [];
        const raw = response?.data?.subjects_taken;

        if (raw) {
          try {
            const normalized = typeof raw === "string" ? raw.replace(/'/g, '"') : raw;
            parsedSubjects = typeof normalized === "string" ? JSON.parse(normalized) : normalized;
          } catch (err) {
            if (typeof raw === "string") {
              parsedSubjects = raw.split(",").map((s) => s.trim()).filter(Boolean);
            } else {
              parsedSubjects = [];
            }
          }
        } else {
          parsedSubjects = [];
        }

        if (typeof parsedSubjects === "string") {
          parsedSubjects = [parsedSubjects];
        }

        if (!Array.isArray(parsedSubjects)) {
          parsedSubjects = [];
        }
        parsedSubjects = parsedSubjects.map((s: any) => String(s));

        setSubjects(parsedSubjects as string[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Axios error ❌", error);
        setHasError(true);
        setErrorMessage("Failed to load student data. Please try again later.");
        setIsLoading(false);
      }
    };

    if (enrollmentid) {
      fetchData();
    } else {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("Missing enrollment id.");
    }
  }, [enrollmentid]);

  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const subFolders = ["Resources", "Tests", "Tasks"];
  const navigate = useNavigate();

  const handleSubjectClick = (subject: string) => {
    setExpandedSubject((prev) => (prev === subject ? null : subject));
  };

  // UPDATED: navigate depending on folder, and stopPropagation so parent click doesn't toggle collapse
  const handleSubFolderClick = (
    subject: string,
    folder: string,
    e?: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e) e.stopPropagation();

    const encoded = encodeURIComponent(subject);
    // Map folder name to route prefix
    let basePath = "/resources"; // default
    switch (folder.toLowerCase()) {
      case "resources":
        basePath = "/resources";
        break;
      case "tests":
        basePath = "/test";
        break;
      case "tasks":
        basePath = "/task";
        break;
      default:
        basePath = "/resources";
    }

    navigate(`${basePath}/${encoded}`);
  };

  return (
    <div className="h-full w-full flex flex-col p-6 bg-[#f4f9f6]">
      <div className="flex justify-center">
        <h2 className="w-fit text-md text-center font-semibold text-[#f4f9f6] px-4 py-2 mb-4 border rounded-lg bg-[#53825e]">
          Subjects
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading subjects...</div>
      ) : hasError ? (
        <div className="text-center text-red-600 py-8">{errorMessage}</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-8">No subjects found.</div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {subjects.map((subject, idx) => (
            <div
              key={`${subject}-${idx}`}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[20%]"
            >
              {/* Subject Folder */}
              <div
                onClick={() => handleSubjectClick(subject)}
                className="flex items-center gap-3 cursor-pointer bg-white shadow-md rounded-xl p-4 hover:bg-[#e8f3ec] transition-colors duration-200"
              >
                <Folder size={30} className="text-yellow-500" fill="currentColor" />
                <span className="text-md font-semibold text-[#2f5233]">{subject}</span>
              </div>

              {/* Subfolders (only if expanded) */}
              {expandedSubject === subject && (
                <div className="ml-10 mt-2 flex flex-col gap-2">
                  {subFolders.map((folder, i) => (
                    <div
                      key={`${folder}-${i}`}
                      // pass event to handler so we can stopPropagation
                      onClick={(e) => handleSubFolderClick(subject, folder, e)}
                      className="flex items-center gap-2 cursor-pointer bg-[#fdfdfd] shadow-sm rounded-lg px-3 py-2 hover:bg-[#f0f7f2] transition-colors"
                    >
                      <Folder size={22} className="text-green-600" fill="currentColor" />
                      <span className="text-sm font-medium text-[#2f5233]">{folder}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectList;
