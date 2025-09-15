
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LearningProgressChart, { type Dataset, type ChartConfig } from "../../../CommonComponents/LineGraph";
import type { RootState } from "../../../store/store";
import { setSubject } from "../../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../../../CommonComponents/SubjectDropDown";
import Cookies from "js-cookie";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { sanitizeText } from "../../../utils/DescParagraph"; // shared util
import AssessmentTable from "../../../CommonComponents/Table";

interface SubjectSummaryProps {
  leftExpanded: boolean;
  rightExpanded: boolean;
  toggleLeft?: () => void;
  toggleRight?: () => void;
}

/** Minimal typed shapes (expand if needed) */
interface EolData {
  obtained_marks?: string;
  average?: number | string;
  cnt?: number;
  topic?: string | string[]; // e.g. "['Scratch Interface', ...]" or already-parsed array
  total_marks?: number | string; // e.g. "5.00"
  [key: string]: any;
}
interface AssessmentRecord {
  enrollment: string;
  subject: string;
  evaluation_criteria?: string;
  max_score_old?: string | number;
  descriptive_analysis?: string;
  prescriptive_analysis?: string;
  current_average_t1?: string;
  current_average?: string;
  current_percentage?: string;
  [key: string]: any;
}
interface EngagementAnalysis {
  dates?: string;
  engagement_analysis?: number[] | string;
  descriptive_sub?: string;
  prescriptive_sub?: string;
  current_sub_pct?: number | string;
  predicted_sub_pct?: number | string;
  current_sub_grade?: number | string;
  predicted_sub_grade?: number | string;
  [key: string]: any;
}

const toNumber = (v: unknown, fallback = 0): number => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const cleaned = v.trim();
    if (cleaned === "") return fallback;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(v as any);
  return Number.isFinite(n) ? n : fallback;
};



const IndividualSubject: React.FC<SubjectSummaryProps> = ({}) => {
  const dispatch = useDispatch();
  const selectedSubject = useSelector((state: RootState) => state.subject.selectedSubject);
  const checkdata = useSelector((state: RootState) => state.subject);
  const location = useLocation();
  const { currentGrade } = location.state || {};
  const subjectArray = Object.keys(checkdata.subjects || {}); // fallback list from store
  const navigate = useNavigate();
  const enrollmentid = Cookies.get("enrollmentId");

  // NEW: subjects fetched from enrollment API (preferred for dropdown)
  const [enrollmentSubjects, setEnrollmentSubjects] = useState<string[]>([]);

  // track separate loading flows so the full-page loader only disappears when both are finished
  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const anyLoading = isEnrollmentLoading || isDataLoading;

  const [eolData, setEolData] = useState<EolData | null>(null);
  const [faData, setFaData] = useState<AssessmentRecord[] | null>(null);
  const [saData, setSaData] = useState<AssessmentRecord[] | null>(null);
  const [engagementAnalysis, setEngagementAnalysis] = useState<EngagementAnalysis | null>(null);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log(selectedSubject,"selectedsubject");
  



  // helpful mapping for count key prefixes (handles FA -> count_fawriting, SDL -> count_sdl, STEAM -> count_steam, WT -> count_wt, IA -> count_ia)
  const countPrefixFromCriteria = (crit?: string) => {
    if (!crit) return "";
    const low = crit.trim().toLowerCase();
    if (low === "fa" || low.includes("fa") || low.includes("fawriting") || low.includes("writing")) return "fawriting";
    if (low.includes("sdl")) return "sdl";
    if (low.includes("steam")) return "steam";
    if (low.includes("wt")) return "wt";
    if (low.includes("ia")) return "ia";
    // fallback: normalized
    return low.replace(/[^a-z0-9]+/g, "_");
  };

  // --- NEW: fetch enrollment to get subjects_taken ---
  // We intentionally DO NOT include selectedSubject in deps to avoid re-running enrollment fetch on subject change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!enrollmentid) {
      // no enrollment available -> ensure loading false and clear subjects
      setEnrollmentSubjects([]);
      setIsEnrollmentLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();
    const url = `https://sfhuaftz5k.execute-api.ap-south-1.amazonaws.com/dev/api/enrollments/${enrollmentid}`;

    setIsEnrollmentLoading(true);

    (async () => {
      try {
        const res = await axios.get(url, { signal: controller.signal });
        if (!mounted) return;
        const data = res?.data ?? {};

        // subjects_taken may be an array or a string like "['Design', 'English', ...]"
        const rawSubjects = data.subjects_taken;
        let parsed: string[] = [];

        if (Array.isArray(rawSubjects)) {
          parsed = rawSubjects.map(String);
        } else if (typeof rawSubjects === "string") {
          const normalized = rawSubjects.trim();
          try {
            // Try JSON parse after converting single quotes to double quotes
            const attempt = normalized.replace(/'/g, '"');
            const p = JSON.parse(attempt);
            if (Array.isArray(p)) parsed = p.map(String);
          } catch {
            // Fallback: extract tokens inside single quotes
            const matches = Array.from(normalized.matchAll(/'([^']+)'/g), (m) => m[1]);
            if (matches.length) parsed = matches;
            else {
              // Last fallback: split by commas and strip quotes/brackets
              parsed = normalized
                .replace(/^\[|\]$/g, "")
                .split(",")
                .map((s) => s.replace(/['"]/g, "").trim())
                .filter(Boolean);
            }
          }
        }

        // Trim + dedupe
        parsed = parsed.map((s) => s.trim()).filter(Boolean);
        parsed = Array.from(new Set(parsed));

        // Save to state (will be used as the sole source for dropdown options)
        setEnrollmentSubjects(parsed);

        // If no selectedSubject in store, prefer strongest_subject from API, else first parsed subject
        if (!selectedSubject) {
          const preferred =
            data.strongest_subject && parsed.includes(String(data.strongest_subject).trim())
              ? String(data.strongest_subject).trim()
              : parsed[0];
          if (preferred) dispatch(setSubject(preferred));
        }
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          // aborted request - nothing to do
        } else {
          console.warn("Failed to fetch enrollment subjects:", err?.message ?? err);
          setEnrollmentSubjects([]);
        }
      } finally {
        if (mounted) setIsEnrollmentLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [enrollmentid, dispatch]);

  // Fetch data (EOL / FA / SA / subject-level)
  useEffect(() => {
    if (!enrollmentid || !selectedSubject) {
      // nothing to fetch — make sure loader flags are consistent
      setIsDataLoading(false);
      return;
    }

    const controller = new AbortController();
    const base = "https://sfhuaftz5k.execute-api.ap-south-1.amazonaws.com/dev/api";

    const fetchAll = async () => {
      setIsDataLoading(true);
      setHasError(false);
      setErrorMessage(null);
      try {
        const urls = [
          `${base}/assessments/eol/${enrollmentid}~${selectedSubject}/`,
          `${base}/assessments/fa/${enrollmentid}`, // enrollment-specific FA endpoint
          `${base}/assessments/sa/`,
          `${base}/subjects/${enrollmentid}~${selectedSubject}/`,
        ];

        const [eolRes, faRes, saRes, engagementRes] = await Promise.allSettled([
          axios.get(urls[0], { signal: controller.signal }),
          axios.get(urls[1], { signal: controller.signal }),
          axios.get(urls[2], { signal: controller.signal }),
          axios.get(urls[3], { signal: controller.signal }),
        ]);

        if (eolRes.status === "fulfilled") setEolData(eolRes.value.data ?? null);
        else {
          console.warn("EOL fetch failed:", (eolRes as any).reason);
          setEolData(null);
        }

      if (faRes.status === "fulfilled") {
  const allFa: AssessmentRecord[] = Array.isArray(faRes.value.data) ? faRes.value.data : faRes.value.data?.results ?? [];

  // --- Special-case mapping for Visual Arts (only for FA) ---
  // If the selected subject is exactly "Visual Arts", we want to match API records
  // that may be "Visual arts". Do a case-insensitive comparison to be tolerant.
  const faMatchSubject = selectedSubject === "Visual Arts" ? "Visual arts" : selectedSubject;
  const faMatchLower = (faMatchSubject ?? "").toString().trim().toLowerCase();

  const recordsForSubject = allFa.filter((item) => {
    if (item.enrollment !== enrollmentid) return false;
    const recSubj = (item.subject ?? "").toString().trim().toLowerCase();
    // case-insensitive equality; this will treat "Visual Arts" and "Visual arts" as equal
    return recSubj === faMatchLower;
  });

  setFaData(recordsForSubject.length ? recordsForSubject : null);
} else {
  console.warn("FA fetch failed:", (faRes as any).reason);
  setFaData(null);
}


        if (saRes.status === "fulfilled") {
          const allSa: AssessmentRecord[] = Array.isArray(saRes.value.data) ? saRes.value.data : saRes.value.data?.results ?? [];
          const recordsForSubject = allSa.filter((item) => item.enrollment === enrollmentid && item.subject === selectedSubject);
          setSaData(recordsForSubject.length ? recordsForSubject : null);
        } else {
          console.warn("SA fetch failed:", (saRes as any).reason);
          setSaData(null);
        }

        if (engagementRes.status === "fulfilled") setEngagementAnalysis(engagementRes.value.data ?? null);
        else {
          console.warn("Engagement fetch failed:", (engagementRes as any).reason);
          setEngagementAnalysis(null);
        }
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") return;
        console.error("fetchAll error:", err);
        setHasError(true);
        setErrorMessage(err?.message || "Something went wrong while fetching data");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, [enrollmentid, selectedSubject]);

  // Select first subject if none
  useEffect(() => {
    // prefer enrollmentSubjects (from API). fallback to subjectArray (redux).
    const sources = enrollmentSubjects.length ? enrollmentSubjects : subjectArray;
    if (!selectedSubject && sources.length > 0) dispatch(setSubject(sources[0]));
  }, [dispatch, selectedSubject, subjectArray, enrollmentSubjects]);

  function parseMarks(raw?: unknown): number[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((v) => {
        const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
        return Number.isFinite(n) ? n : 0;
      });
    }
    const s = String(raw).trim();
    const decimalMatches = Array.from(s.matchAll(/Decimal\('([+-]?\d+(?:\.\d+)?)'\)/g), (m) => m[1]);
    if (decimalMatches.length) return decimalMatches.map((t) => Number(t));
    const numMatches = Array.from(s.matchAll(/[+-]?\d+(\.\d+)?/g), (m) => m[0]);
    if (numMatches.length) return numMatches.map((t) => Number(t));
    return [];
  }

  const eolDataset = useMemo<
    { datasets: Dataset[]; chartConfig: ChartConfig } | null
  >(() => {
    if (!eolData) return null;

    const marks = parseMarks(eolData.obtained_marks); // number[]
    const len = marks.length;
    if (len === 0) return null;

    // Build labels like Task 1, Task 2, ...
    const points = Array.from({ length: len }).map((_, i) => {
      const label = `Task ${i + 1}`;
      const n = toNumber(marks[i], 0);
      const value = Number.isFinite(n) ? n : 0;
      return { label, value };
    });

    // Clamp values between 0..5 (optional)
    const normalizedPoints = points.map((p) => ({
      label: p.label,
      value: Math.max(0, Math.min(5, p.value)),
    }));

    // Prepend origin so the curve begins at y=0
    const pts = [{ label: "", value: 0 }, ...normalizedPoints];

    // Yellow halo dataset
    const areaDataset: Dataset = {
      label: "EOL (area)",
      data: pts.map((pt) => ({ label: pt.label, value: toNumber(pt.value, 0) })),
      borderColor: "rgba(250, 204, 21, 0.25)",
      backgroundColor: "rgba(250, 204, 21, 0.22)",
      tension: 0.6,
      fill: true,
    };

    // Blue line dataset
    const lineDataset: Dataset = {
      label: "EOL (line)",
      data: pts.map((pt) => ({ label: pt.label, value: toNumber(pt.value, 0) })),
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.08)",
      tension: 0.35,
      fill: false,
      pointRadius: 6,
      pointHoverRadius: 8,
    };

    const chartConfig: ChartConfig = {
      title: `EOL Scores`,
      xAxisLabel: "Task",
      yAxisLabel: "Score",
      stepSize: 1,
      showLegend: false,
      showGrid: true,
      chartType: "line",
      yMin: 0,
      yMax: 5,
    };

    return { datasets: [areaDataset, lineDataset], chartConfig };
  }, [eolData]);

  // Engagement dates parsing
  const datesArray: string[] = useMemo(() => {
    if (!engagementAnalysis?.dates) return [];
    try {
      const raw = String(engagementAnalysis.dates).trim();
      if (raw.startsWith("[")) {
        const normalized = raw.replace(/'/g, '"');
        const parsed = JSON.parse(normalized);
        if (Array.isArray(parsed)) return parsed.map(String);
      }
      return Array.from(raw.matchAll(/\d{4}-\d{2}-\d{2}/g), (m) => m[0]);
    } catch (err) {
      console.warn("Failed to parse engagement dates:", err);
      const fallback = String(engagementAnalysis.dates).match(/\d{4}-\d{2}-\d{2}/g) ?? [];
      return Array.from(fallback);
    }
  }, [engagementAnalysis?.dates]);

  // Engagement dataset
  const attentiveDatasets: Dataset[] = useMemo(() => {
    const rawEng = engagementAnalysis?.engagement_analysis;
    if (!rawEng || !datesArray.length) return [];
    let arr: number[] = [];
    if (Array.isArray(rawEng)) arr = rawEng.map((v) => toNumber(v, 0));
    else {
      try {
        const parsed = JSON.parse(String(rawEng).replace(/'/g, '"'));
        if (Array.isArray(parsed)) arr = parsed.map((v) => toNumber(v, 0));
      } catch {
        arr = Array.from(String(rawEng).matchAll(/\d+(\.\d+)?/g), (m) => toNumber(m[0], 0));
      }
    }
    if (!arr.length) return [];
    return [
      {
        label: "Engagement",
        data: arr.map((value: number, index: number) => ({ label: datesArray[index] ?? `T${index + 1}`, value: Math.round(toNumber(value, 0)) })),
      },
    ];
  }, [engagementAnalysis?.engagement_analysis, datesArray]);

  const attentiveConfig = {
    title: "Engagement Analysis",
    xAxisLabel: "Date",
    yAxisLabel: "Engagement (%)",
    stepSize: 10,
    chartType: "line",
    showLegend: false,
    xAxisType: "category",
    xAxisLabelRotation: 45,
  } as const;

  // Terms config
  let faTerms: { name: string }[] = [];
  let saTerms: { name: string }[] = [];
  if (["Grade 10", "Grade 12"].includes(currentGrade)) {
    faTerms = [{ name: "Term 1 (JUL-SEP)" }, { name: "Term 2 (OCT-DEC)" }, { name: "Term 3 (JAN-MAR)" }];
    saTerms = [...faTerms];
  } else {
    faTerms = [{ name: "Term 1 (JUL-DEC)" }, { name: "Term 2 (JAN-JUN)" }];
    saTerms = [...faTerms];
  }

  // Helper to build count array for a record based on the criteria-specific prefix (e.g., 'sdl' -> count_sdl_t1 ...)
  function countsForRecordByCriteria(rec: any, criteria: string, termsLength: number) {
    const prefix = countPrefixFromCriteria(criteria);
    const counts: number[] = [];
    for (let i = 1; i <= termsLength; i++) {
      const key = `count_${prefix}_t${i}`;
      const raw = rec?.[key];
      counts.push(Number.isFinite(Number(raw)) ? Number(raw) : 0);
    }
    return counts;
  }

  // Helper to extract averages per term for a record (current_average_t1 ... tN)
  function averagesForRecord(rec: any, termsLength: number) {
    const arr: number[] = [];
    for (let i = 1; i <= termsLength; i++) {
      const key = `current_average_t${i}`;
      const raw = rec?.[key];
      const n = typeof raw === "number" ? raw : Number(raw);
      arr.push(Number.isNaN(n) ? 0 : n);
    }
    return arr;
  }

  function getTotalTaskCountForRecords(records: any[] | null) {
    if (!records) return 0;
    return records.reduce((sum, rec) => {
      const countKeys = Object.keys(rec || {}).filter((k) => /^count_[a-z0-9_]+_t\d+$/i.test(k));
      const count = countKeys.reduce((s, key) => s + (parseInt(rec[key]) || 0), 0);
      return sum + count;
    }, 0);
  }

  const faTaskCount = useMemo(() => getTotalTaskCountForRecords(faData), [faData]);
  const saTaskCount = useMemo(() => getTotalTaskCountForRecords(saData), [saData]);

  // Build FA table payload
  const faTablePayload = useMemo(() => {
    if (!faData || !faData.length) return null;

    const criteriaOrder: string[] = [];
    const criteriaMap = new Map<string, AssessmentRecord[]>();

    faData.forEach((rec) => {
      const critRaw = (rec.evaluation_criteria || "").toString().trim() || "Unknown";
      if (!criteriaMap.has(critRaw)) {
        criteriaOrder.push(critRaw);
        criteriaMap.set(critRaw, [rec]);
      } else {
        criteriaMap.get(critRaw)!.push(rec);
      }
    });

    const rows = criteriaOrder;

    const tasks2D = rows.map((crit) => {
      const recs = criteriaMap.get(crit)!;
      const termsLength = faTerms.length;
      const aggregatedCounts: number[] = new Array(termsLength).fill(0);
      recs.forEach((r) => {
        const counts = countsForRecordByCriteria(r, crit, termsLength);
        counts.forEach((c, idx) => (aggregatedCounts[idx] = aggregatedCounts[idx] + (Number.isFinite(Number(c)) ? Number(c) : 0)));
      });
      return aggregatedCounts;
    });

    const averages2D = rows.map((crit) => {
      const recs = criteriaMap.get(crit)!;
      const termsLength = faTerms.length;
      const aggregated: number[] = new Array(termsLength).fill(0);
      for (let t = 1; t <= termsLength; t++) {
        const values: number[] = recs.map((r) => {
          const key = `current_average_t${t}`;
          const raw = r?.[key];
          const n = typeof raw === "number" ? raw : Number(raw);
          return Number.isNaN(n) ? 0 : n;
        });
        const nonZero = values.filter((v) => v !== 0);
        aggregated[t - 1] = nonZero.length ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length : 0;
      }
      return aggregated;
    });

    const descriptions = rows.map((crit) => {
      const recs = criteriaMap.get(crit)!;
      return recs.map((r) => r.descriptive_analysis ?? "").filter(Boolean).join("\n") || "";
    });
    const prescriptives = rows.map((crit) => {
      const recs = criteriaMap.get(crit)!;
      return recs.map((r) => r.prescriptive_analysis ?? "").filter(Boolean).join("\n") || "";
    });

    const maxScoresPerRow = rows.map((crit) => {
      const recs = criteriaMap.get(crit)!;
      const raw = recs[0]?.max_score_old ?? 10;
      const num = Number(raw);
      const roundedNearest10 = Number.isNaN(num) ? 10 : Math.round(num / 10) * 10;
      return roundedNearest10 || 10;
    });

    const tableMaxScore = 10;

    const percentages: number[] = rows
      .map((crit) => {
        const recs = criteriaMap.get(crit)!;
        for (const r of recs) {
          const raw = r?.current_percentage ?? r?.current_percentage_t1 ?? r?.current_average_t1 ?? null;
          const n = Number(raw);
          if (!Number.isNaN(n) && n !== 0) return n;
        }
        return 0;
      })
      .filter((n) => !Number.isNaN(n));

    const avgOfPercentages = percentages.length ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0;
    const avgOfPercentagesRounded = Math.round((avgOfPercentages + Number.EPSILON) * 100) / 100;

    return {
      rows,
      tasks2D,
      averages2D,
      descriptions,
      prescriptives,
      maxScoresPerRow,
      tableMaxScore,
      avgOfPercentagesRounded,
    };
  }, [faData, faTerms]);

  // Build overall datasets safely coercing numeric values
  const OverallSubjectScore = useMemo(() => {
    const current_pct = toNumber(engagementAnalysis?.current_sub_pct, 0);
    const predicted_pct = toNumber(engagementAnalysis?.predicted_sub_pct, 0);

    return {
      datasets: [
        {
          label: "Subject Score",
          data: [
            { label: "", value: 0 },
            { label: "Current Grade", value: current_pct },
            { label: "Predicted Grade", value: predicted_pct },
          ],
          borderColor: "rgb(79, 70, 229)",
          backgroundColor: "rgba(79, 70, 229, 0.15)",
          fill: false,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ] as Dataset[],
      config: {
        title: "Subjectwise Score",
        chartType: "line" as const,
        xAxisLabel: "Score Type",
        yAxisLabel: "Score",
        showLegend: false,
        showGrid: true,
        stepSize: 10,
        yMin: 0,
        yMax: 100,
      } as ChartConfig,
      height: "300px",
      showSummary: false,
    };
  }, [engagementAnalysis?.current_sub_pct, engagementAnalysis?.predicted_sub_pct]);

  const overallGraderData = useMemo(() => {
    const current_grade = toNumber(engagementAnalysis?.current_sub_grade, 0);
    const predicted_grade = toNumber(engagementAnalysis?.predicted_sub_grade, 0);

    return {
      datasets: [
        {
          label: "Subject Grade",
          data: [
            { label: "", value: 1 },
            { label: "Current Grade", value: current_grade },
            { label: "Predicted Grade", value: predicted_grade },
          ],
          borderColor: "rgb(79, 70, 229)",
          backgroundColor: "rgba(79, 70, 229, 0.15)",
          fill: false,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ] as Dataset[],
      config: {
        title: "Subjectwise Grade",
        chartType: "line" as const,
        xAxisLabel: "Grade Type",
        yAxisLabel: "Grade",
        showLegend: false,
        showGrid: true,
        stepSize: 1,
        yMin: 1,
        yMax: 7,
      } as ChartConfig,
      height: "300px",
      showSummary: false,
    };
  }, [engagementAnalysis?.current_sub_grade, engagementAnalysis?.predicted_sub_grade]);

  // Loading / error UI
  if (anyLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-lg">Loading student data...</p>
        </div>
      </div>
    );
  }
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Which options to pass to Dropdown? Prefer API enrollmentSubjects, fallback to subjectArray from redux.
  const dropdownOptions = enrollmentSubjects.length ? enrollmentSubjects : subjectArray;

  const handleSelect = (subject: string) => {
    dispatch(setSubject(subject));
    navigate(`/subject-summary/${subject}`);
  };

  // MAIN RENDER
  return (
    <>
      <div className="flex sm:justify-end">
        <div className="w-full sm:w-auto sm:basis-[50%]">
          <div className="rounded-xl shadow-md p-4 bg-[#f3e8ff] border border-[#ad46ff] flex items-center justify-between gap-6 ">
            <div>
              <div className="text-xs text-[#ad46ff] font-bold">Current Score</div>
              <div className="text-xl font-bold mt-1">{Math.round(toNumber(engagementAnalysis?.current_sub_pct, 0))}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#ad46ff] font-bold">Current Grade</div>
              <div className="text-xl font-bold mt-1">{engagementAnalysis?.current_sub_grade ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50   w-[100%]">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto ">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Student Personalised Learning Pathway</h1>

            <div className="mt-4 mx-auto flex justify-center">
              <Dropdown options={dropdownOptions} selected={selectedSubject || ""} onSelect={handleSelect} placeholder="Select Subject" />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
            <div
              className={`flex-[0.9] space-y-6`}
            >
              {/* Academic Scores Heading */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-[#4193df] via-[#57a1e7] to-[#7fbef4] text-white px-4 py-2 rounded font-semibold inline">
                  Academic Scores
                </div>
              </div>

              {/* EOL */}
              <div className=" flex flex-col lg:flex-row gap-4 items-start mt-6 px-4 sm:px-6 md:px-[20px] w-full">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex-1 min-w-0 lg:flex-[0.6] w-full">
                  <div className="flex justify-between items-center w-[100%]">
                    <div className="bg-yellow-400 text-gray-800 px-3 py-1 text-xs sm:text-sm rounded text-center font-medium w-[80px] sm:w-[100px]">
                      EOL (Daily)
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <div className="rounded-md p-2 text-center mb-2 w-20 sm:w-24 bg-yellow-100 text-yellow-700">
                        <div className="text-sm sm:text-md font-bold mb-1">{toNumber(eolData?.cnt, 0)}</div>
                        <div className="text-xs font-medium text-yellow-600">Tasks</div>
                      </div>
                      <div className="rounded-md p-2 text-center w-20 sm:w-24 bg-yellow-200 text-yellow-800">
                        <div className="text-sm sm:text-md font-bold mb-1">{toNumber(eolData?.average, 0)}</div>
                        <div className="text-xs font-medium text-yellow-700">Score</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1  lg:flex-[2.1] bg-white rounded-lg border  min-w-0 w-full">
                  {eolDataset ? (
                    <LearningProgressChart datasets={eolDataset.datasets} config={eolDataset.chartConfig} height="250px" />
                  ) : (
                    <div className="text-sm text-gray-500 p-3">No EOL topic data to show.</div>
                  )}
                </div>
              </div>

              {/* FA single table */}
              <div className="flex flex-col lg:flex-row gap-4 items-start mt-6 px-4 sm:px-6 md:px-[30px] w-full">
                {/* left summary card: shows aggregated average of criteria percentages */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex-1 min-w-0 lg:flex-[0.6] w-full">
                  <div className="flex justify-between items-center">
                    <div className="bg-red-400 text-white px-3 py-1 text-xs sm:text-sm rounded text-center font-medium w-[80px] sm:w-[100px]">
                      FA (twice a month)
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <div className="rounded-md p-2 text-center mb-2 w-20 sm:w-24 bg-red-100 text-red-700">
                        <div className="text-sm sm:text-md font-bold mb-1">{faTaskCount || 0}</div>
                        <div className="text-xs font-medium text-red-600">Tasks</div>
                      </div>
                      <div className="rounded-md p-2 text-center w-28 sm:w-32 bg-red-200 text-red-800">
                        <div className="text-sm sm:text-md font-bold mb-1">{faTablePayload ? faTablePayload.avgOfPercentagesRounded : 0}%</div>
                        <div className="text-xs font-medium text-red-700">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: single AssessmentTable with rows = criteria */}
                <div className="flex-1 lg:flex-[2.1] bg-white rounded-lg border p-2 min-w-0 w-full">
                  <div className="space-y-3">
                    {faTablePayload ? (
                      <AssessmentTable
                        rows={faTablePayload.rows}
                        terms={faTerms}
                        tasks={faTablePayload.tasks2D}
                        averages={faTablePayload.averages2D}
                        descriptions={faTablePayload.descriptions}
                        prescriptives={faTablePayload.prescriptives}
                        maxScore={faTablePayload.maxScoresPerRow}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-3">No FA records for this subject.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* SA */}
              <div className="flex flex-col lg:flex-row gap-4 items-start mt-6 px-4 sm:px-6 md:px-[30px] w-full">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex-1 min-w-0 lg:flex-[0.6] w-full">
                  <div className="flex justify-between items-center">
                    <div className="bg-green-400 text-white px-3 py-1 text-xs sm:text-sm rounded text-center font-medium w-[80px] sm:w-[100px]">
                      SA (twice a year)
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <div className="rounded-md p-2 text-center mb-2 w-20 sm:w-24 bg-green-100 text-green-700">
                        <div className="text-sm sm:text-md font-bold mb-1">{saTaskCount || 0}</div>
                        <div className="text-xs font-medium text-green-600">Tasks</div>
                      </div>
                      <div className="rounded-md p-2 text-center w-20 sm:w-24 bg-green-200 text-green-800">
                        <div className="text-sm sm:text-md font-bold mb-1">{saData?.[0]?.current_percentage ?? 0}%</div>
                        <div className="text-xs font-medium text-green-700">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SA tables */}
                <div className="flex-1 lg:flex-[2.1] bg-white rounded-lg border p-2 min-w-0 min-h-[120px] w-full">
                  <div className="space-y-3">
                    {saData && saData.length ? (
                      saData.map((record: any, idx: number) => {
                        const termsLength = saTerms.length;
                        const taskCounts = countsForRecordByCriteria(record, record.evaluation_criteria, termsLength);
                        const averages = averagesForRecord(record, termsLength);

                        const rows = [record.evaluation_criteria || `Criteria ${idx + 1}`];
                        const tasks2D = [taskCounts];
                        const averages2D = [averages];
                        const descriptions = [record.descriptive_analysis ?? ""];
                        const prescriptives = [record.prescriptive_analysis ?? ""];

                        return (
                          <div key={idx} className="bg-white">
                            <AssessmentTable
                              rows={rows}
                              terms={saTerms}
                              tasks={tasks2D}
                              averages={averages2D}
                              descriptions={descriptions}
                              prescriptives={prescriptives}
                              maxScore={Math.round(Number(record.max_score_old ?? 10))}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-500 p-3">No SA records for this subject.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-6 px-4 sm:px-6 md:px-[30px] w-full">
                {/* Descriptive */}
                <div className="border border-gray-200 rounded-lg overflow-hidden basis-full sm:basis-1/2 flex flex-col">
                  <div className="bg-blue-100 px-4 py-2 border-b">
                    <div className="font-semibold text-gray-800">Descriptive Analysis</div>
                    <div className="text-sm text-gray-600">({selectedSubject})</div>
                  </div>
                  <div className="bg-orange-50 px-4 py-3 text-sm text-gray-800 flex-1">
                    {sanitizeText(engagementAnalysis?.descriptive_sub) || "No descriptive analysis available for this subject."}
                  </div>
                </div>

                {/* Prescriptive */}
                <div className="border border-gray-200 rounded-lg overflow-hidden basis-full sm:basis-1/2 flex flex-col">
                  <div className="bg-blue-100 px-4 py-2 border-b">
                    <div className="font-semibold text-gray-800">Prescriptive Analysis</div>
                    <div className="text-sm text-gray-600">({selectedSubject})</div>
                  </div>
                  <div className="bg-orange-50 px-4 py-3 text-sm text-gray-800 flex-1">
                    {sanitizeText(engagementAnalysis?.prescriptive_sub) || "No prescriptive analysis available for this subject."}
                  </div>
                </div>
              </div>

              {/* Smart Analysis / MiniChart / Engagement */}
              <div className="flex justify-center py-2">
                <div className="bg-gradient-to-r from-[#4193df] via-[#57a1e7] to-[#7fbef4] text-white px-4 py-2 rounded font-semibold inline">
                  Smart Analysis
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-center">
                  <div className="lg:basis-[95%]">
                    <LearningProgressChart datasets={overallGraderData.datasets} config={overallGraderData.config} height={overallGraderData.height} />
                    <div className="flex items-center flex-col sm:flex-row sm:justify-around gap-4 mb-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 shadow-sm w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span>Current: {engagementAnalysis?.current_sub_grade || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span>Predicted: {engagementAnalysis?.predicted_sub_grade || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full px-[2.5%] ">
                    <LearningProgressChart datasets={OverallSubjectScore.datasets} config={OverallSubjectScore.config} height={OverallSubjectScore.height} />
                    <div className="flex items-center flex-col sm:flex-row sm:justify-around gap-4 mb-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 shadow-sm w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span>Current: {Math.round(toNumber(engagementAnalysis?.current_sub_pct, 0))}%</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span>Predicted: {Math.round(toNumber(engagementAnalysis?.predicted_sub_pct, 0))}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attentive/Engagement chart */}
                <div className="mt-8 px-4 sm:px-6 md:px-[30px] space-y-8 flex flex-col items-center">
                  <div className="w-full lg:basis-[80%]">
                    <LearningProgressChart height="400px" datasets={attentiveDatasets} config={attentiveConfig} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default IndividualSubject;



