import { useNavigate } from "react-router-dom";
import { setSubject, setSubjectScore, setUser } from "../../../store/store";
import { useDispatch } from "react-redux";
import LearningProgressChart, {
  type Dataset,
} from "../../../CommonComponents/LineGraph";

import { useEffect, useState, useMemo } from "react";
import WelcomeHeader from "../../../CommonComponents/WelcomeHeader";
import axios from "axios";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { sanitizeText } from "../../../utils/DescParagraph";

export default function StudentPathway() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const enrollmentid = Cookies.get("enrollmentId");

  // ✅ States
  const [api, setApi] = useState<any>({});
  const [subjectScores, setSubjectScores] = useState<
    Record<string, { currentScore: number; predictedScore: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Unified subject colors
  // Each entry controls the card class, badge class and chart colors (border + background)
  const subjectColors = [
    {
      card: "bg-blue-100 border border-blue-400",
      badge: "bg-blue-500 text-white",
      chart: { border: "rgb(59, 130, 246)", background: "rgba(59, 130, 246, 0.15)" },
    },
    {
      card: "bg-green-100 border border-green-400",
      badge: "bg-green-500 text-white",
      chart: { border: "rgb(34, 197, 94)", background: "rgba(34, 197, 94, 0.15)" },
    },
    {
      card: "bg-yellow-100 border border-yellow-400",
      badge: "bg-yellow-500 text-white",
      chart: { border: "rgb(245, 158, 11)", background: "rgba(245, 158, 11, 0.15)" },
    },
    {
      card: "bg-purple-100 border border-purple-400",
      badge: "bg-purple-500 text-white",
      chart: { border: "rgb(168, 85, 247)", background: "rgba(168, 85, 247, 0.15)" },
    },
    {
      card: "bg-pink-100 border border-pink-400",
      badge: "bg-pink-500 text-white",
      chart: { border: "rgb(236, 72, 153)", background: "rgba(236, 72, 153, 0.15)" },
    },
    {
      card: "bg-red-100 border border-red-400",
      badge: "bg-red-500 text-white",
      chart: { border: "rgb(239, 68, 68)", background: "rgba(239, 68, 68, 0.15)" },
    },
    {
      card: "bg-indigo-100 border border-indigo-400",
      badge: "bg-indigo-500 text-white",
      chart: { border: "rgb(79, 70, 229)", background: "rgba(79, 70, 229, 0.15)" },
    },
    {
      card: "bg-teal-100 border border-teal-400",
      badge: "bg-teal-500 text-white",
      chart: { border: "rgb(20, 184, 166)", background: "rgba(20, 184, 166, 0.15)" },
    },
    {
      card: "bg-cyan-100 border border-cyan-400",
      badge: "bg-cyan-500 text-white",
      chart: { border: "rgb(6, 182, 212)", background: "rgba(6, 182, 212, 0.15)" },
    },
    {
      card: "bg-orange-100 border border-orange-400",
      badge: "bg-orange-500 text-white",
      chart: { border: "rgb(249, 115, 22)", background: "rgba(249, 115, 22, 0.15)" },
    },
    {
      card: "bg-lime-100 border border-lime-400",
      badge: "bg-lime-500 text-white",
      chart: { border: "rgb(132, 204, 22)", background: "rgba(132, 204, 22, 0.15)" },
    },
    {
      card: "bg-emerald-100 border border-emerald-400",
      badge: "bg-emerald-500 text-white",
      chart: { border: "rgb(16, 185, 129)", background: "rgba(16, 185, 129, 0.15)" },
    },
    {
      card: "bg-fuchsia-100 border border-fuchsia-400",
      badge: "bg-fuchsia-500 text-white",
      chart: { border: "rgb(217, 70, 239)", background: "rgba(217, 70, 239, 0.15)" },
    },
    {
      card: "bg-rose-100 border border-rose-400",
      badge: "bg-rose-500 text-white",
      chart: { border: "rgb(244, 63, 94)", background: "rgba(244, 63, 94, 0.15)" },
    },
    {
      card: "bg-sky-100 border border-sky-400",
      badge: "bg-sky-500 text-white",
      chart: { border: "rgb(14, 165, 233)", background: "rgba(14, 165, 233, 0.15)" },
    },
    {
      card: "bg-violet-100 border border-violet-400",
      badge: "bg-violet-500 text-white",
      chart: { border: "rgb(139, 92, 246)", background: "rgba(139, 92, 246, 0.15)" },
    },
    {
      card: "bg-amber-100 border border-amber-400",
      badge: "bg-amber-500 text-white",
      chart: { border: "rgb(245, 196, 12)", background: "rgba(245, 196, 12, 0.15)" },
    },
    {
      card: "bg-red-200 border border-red-500",
      badge: "bg-red-600 text-white",
      chart: { border: "rgb(220, 38, 38)", background: "rgba(220, 38, 38, 0.15)" },
    },
    {
      card: "bg-blue-200 border border-blue-500",
      badge: "bg-blue-600 text-white",
      chart: { border: "rgb(37, 99, 235)", background: "rgba(37, 99, 235, 0.15)" },
    },
    {
      card: "bg-green-200 border border-green-500",
      badge: "bg-green-600 text-white",
      chart: { border: "rgb(22, 163, 74)", background: "rgba(22, 163, 74, 0.15)" },
    },
  ];


  // ✅ Fetch Enrollment + Subjects
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");

      try {
        const response = await axios.get(
          `https://sfhuaftz5k.execute-api.ap-south-1.amazonaws.com/dev/api/enrollments/${enrollmentid}`
        );
        setApi(response.data || {});
        if (response.data) {
          dispatch(
            setUser({ name: response.data.user_name, grade: response.data.grade })
          );
        }

        const subjects = response.data?.subjects_taken
          ? JSON.parse(response.data.subjects_taken.replace(/'/g, '"'))
          : [];

        const scores: Record<string, { currentScore: number; predictedScore: number }> =
          {};

        await Promise.all(
          subjects.map(async (sub: string) => {
            try {
              const res = await axios.get(
                `https://sfhuaftz5k.execute-api.ap-south-1.amazonaws.com/dev/api/subjects/${enrollmentid}~${sub}`
              );
              scores[sub] = {
                currentScore: Number(res.data.current_sub_pct) || 0,
                predictedScore: Number(res.data.predicted_sub_pct) || 0,
              };
            } catch (err) {
              console.error(`❌ Error fetching subject ${sub}`, err);
              // don't throw — continue with defaults
              scores[sub] = { currentScore: 0, predictedScore: 0 };
            }
          })
        );

        setSubjectScores(scores);
        setIsLoading(false);
      } catch (error) {
        console.error("Axios error ❌", error);
        setHasError(true);
        setErrorMessage("Failed to load student data. Please try again later.");
        setIsLoading(false);
      }
    };

    // only fetch if enrollmentid exists
    if (enrollmentid) {
      fetchData();
    } else {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("Missing enrollment id.");
    }
  }, [enrollmentid, dispatch]);

 const learningCurve = useMemo(() => {
  const raw: string = api?.current ?? ""; // "[Decimal('0.00'), Decimal('80.14')]"

  // safely extract numeric strings and convert to numbers
  const matches: string[] = raw.match(/-?\d+(\.\d+)?/g) || [];
  const nums: number[] = matches.map((s: string) => Number(s));

  const first: number = nums[0] ?? 0;           // fallback to 0 if missing
  const second: number = nums[1] ?? NaN;       // NaN when second not present

  // labels: last year label + 1..5
  const labels: string[] = ["lastYear", "1", "2", "3", "4", "5"];

  // values: must all be numbers (use NaN to represent missing)
  const values: number[] = [first, second, NaN, NaN, NaN, NaN];

  // Build data array matching your Dataset->DataPoint shape
  const dataPoints = labels.map((lbl, i) => ({
    label: lbl,
    value: values[i], // always a number (may be NaN)
  }));

  const dataset = {
    label: "Learning Curve",
    data: dataPoints,
    borderColor: "rgb(59, 130, 246)",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    fill: false,
    tension: 0.3,
  };

  return {
    datasets: [dataset],
    config: {
      title: "Learning Curve",
      chartType: "line" as const,
      xAxisLabel: "Session",
      yAxisLabel: "Score",
      showLegend: false,
      showGrid: true,
      stepSize: 10,
    },
    height: "400px",
    showSummary: false,
  };
}, [api]);


  // ✅ Grade & subjects
  const currentGrade = api?.grade || "Grade 8";
  const subjectsArray = useMemo(
    () =>
      api?.subjects_taken
        ? JSON.parse(api.subjects_taken.replace(/'/g, '"'))
        : [],
    [api]
  );

  // ✅ Overall scores
  const overallMarks = api?.current_pct_overall
    ? Number(api.current_pct_overall)
    : 0;

  const predictedScore = api?.predictive_pct_overall
    ? Number(api.predictive_pct_overall)
    : 0;

  // ✅ Generate subject datasets (uses unified subjectColors)
  const subjectDataArray = useMemo(
    () =>
      subjectsArray.map((subject: any, index: number) => {
        const scores = subjectScores[subject] || {
          currentScore: 0,
          predictedScore: 0,
        };

        const colorSet = subjectColors[index % subjectColors.length];

        return {
          name: subject,
          currentScore: scores.currentScore,
          predictedScore: scores.predictedScore,
          colorSet,
          chartDataset: {
            label: `${subject} Performance`,
            borderColor: colorSet.chart.border,
            backgroundColor: colorSet.chart.background,
            data: [
              { label: "", value: 0 },
              { label: "Current Score", value: scores.currentScore },
              { label: "Predicted Score", value: scores.predictedScore },
              // { label: "Target Score", value: 100 },
            ],
          },
        };
      }),
    [subjectsArray, subjectScores]
  );

  // ✅ Push subject scores to Redux
  useEffect(() => {
    subjectDataArray.forEach((subject: any) => {
      dispatch(
        setSubjectScore({
          subject: subject.name,
          currentScore: subject.currentScore,
          predictedScore: subject.predictedScore,
        })
      );
    });
  }, [dispatch, subjectDataArray]);

  // ✅ Charts config
 const subjectChartData = {
  datasets: subjectDataArray.map((s: any) => s.chartDataset),
  config: {
    title: "Subject-wise Performance Trend",
    chartType: "line" as const,
    xAxisLabel: "Evaluation",
    yAxisLabel: "Score",
    showLegend: false,
    showGrid: true,
  },
  height: "400px",
  showSummary: false,
};

  const overallChartData = {
    datasets: [
      {
        label: "Overall Score",
        data: [
          { label: "", value: 0 },
          { label: "Current Score", value: overallMarks },
          { label: "Predicted Score", value: Number(predictedScore) },
          // { label: "Target Score", value: 100 },
        ],
      },
    ],
    config: {
      title: "Overall Score",
      chartType: "line" as const,
      xAxisLabel: "Evaluation",
      yAxisLabel: "Score",
      showLegend: false,
      showGrid: true,
    thresholdLine: 75, // <-- add here too

    },
    height: "400px",
    showSummary: true,
  };

const overallGraderData = {
  datasets: [
    {
      label: "Overall Grade",
      data: [
        { label: "Start", value: 1 }, // ✅ start from 1 instead of 0
        { label: "Current Grade", value: api?.current_grade_overall||0 },     // e.g. 6
        { label: "Predicted Grade", value:api?.predicted_grade_overall||0 }, // e.g. 7
      ],
      borderColor: "rgb(79, 70, 229)",
      backgroundColor: "rgba(79, 70, 229, 0.15)",
      fill: false,
      tension: 0.3,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
  config: {
    title: "Overall Grade",
    chartType: "line" as const,
    xAxisLabel: "Grade Type",
    yAxisLabel: "Grade (1 - 7)",
    showLegend: false,
    showGrid: true,
    stepSize: 1,
    yMin: 1, // ✅ axis starts at 1
    yMax: 7, // ✅ axis ends at 7
  },
  height: "400px",
  showSummary: false,
};





   

  // const attentiveDatasets: Dataset[] = [
  //   {
  //     label: "Attentive",
  //     data: api?.engagement_analysis
  //       ? api.engagement_analysis.map((e: any) => ({
  //           label: e.date,
  //           value: e.eng * 100,
  //         }))
  //       : [],
  //   },
  // ];

const attentiveConfig = {
  title: "Engagement by Subject",
  xAxisLabel: "Subject",
  yAxisLabel: "Average Engagement (%)",
  stepSize: 10,
  chartType: "line" as const, // ✅ line graph
  showLegend: false,
};

 const attentiveDatasets: Dataset[] = useMemo(() => {
  const engagement = api?.engagement_analysis || {};

  // compute average engagement per subject
  const subjectAverages = Object.entries(engagement).map(([subject, values]) => {
    const arr = Array.isArray(values) ? values : [];
    if (arr.length === 0) return { subject, avg: 0 };

    const normalized = arr.map((v: any) => {
      const num = typeof v === "number" ? v : Number(v);
      // handle decimals (0..1) → percent
      return num > 0 && num <= 1 ? num * 100 : num;
    });

    const avg = normalized.reduce((a, b) => a + b, 0) / normalized.length;
    return { subject, avg: Math.round(avg * 100) / 100 };
  });

  return [
    {
      label: "Average Engagement",
      data: subjectAverages.map((s) => ({
        label: s.subject, // ✅ subject on X-axis
        value: s.avg,     // ✅ score on Y-axis
      })),
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      fill: false,   // ✅ keep line only, no fill
      tension: 0.3,  // ✅ smooth curve
    },
  ];
}, [api]);



  // ✅ Conditional UI placed AFTER all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 sm:px-[2%] lg:px-[1%] flex flex-col">
      {/* Header + Card row */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2  w-full">
  {/* Left: Welcome header */}
  <div className="basis-[50%] min-w-0">
    <WelcomeHeader name={api?.user_name || ""} grade={api?.grade || ""} />
  </div>

  {/* Right: Score/Grade card */}
  <div className="w-full basis-[50%] sm:w-auto">
    <div className="rounded-xl shadow-md p-4 bg-[#f3e8ff] border border-[#ad46ff] flex items-center justify-between gap-6  h-[130px]">
      <div>
        <div className="text-xs text-[#ad46ff] font-bold">Current Score</div>
        <div className="text-xl font-bold mt-1">{Math.round(overallMarks)}%</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-[#ad46ff] font-bold">Current Grade</div>
        <div className="text-xl font-bold mt-1">{api?.current_grade_overall||0}</div>
      </div>
    </div>
  </div>
</div>



      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-6 mt-4">
        Student Personalised Learning Pathway
      </h1>

      {/* Subject cards + overall chart */}
      <div className="flex flex-col lg:flex-row  w-full justify-between">
        {/* Subject cards */}
        <div className="w-full overflow-x-auto">
          <div className="flex flex-wrap gap-4  mt-6 ">
            {subjectDataArray.map((subject: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col rounded-xl shadow-md p-3 sm:p-4 cursor-pointer hover:shadow-lg transition ${subject.colorSet.card}`}
                onClick={() => {
                  dispatch(setSubject(subject.name));
                  navigate(`/subject-summary/${subject.name}`, {
                    state: { subjects: subjectDataArray, currentGrade },
                  });
                }}
              >
                <div className="flex gap-2 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold ${subject.colorSet.badge}`}
                    >
                      {subject.name[0]}
                    </div>
                    <p className="text-gray-800 font-semibold text-sm sm:text-base">
                      {subject.name}
                    </p>
                  </div>

                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    {subject.currentScore}%
                    <span className="text-gray-400 font-bold ml-1">{">"}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Chart */}
      
      </div>
<div className="mt-6 flex justify-center gap-2">
  {/* Left Chart */}
  <div className="w-1/2 flex flex-col">
    <LearningProgressChart
      datasets={overallChartData.datasets}
      config={overallChartData.config}
      height={overallChartData.height}
    />

    <div className="flex items-center flex-col sm:flex-row sm:justify-around gap-4 mt-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 shadow-sm w-fit">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
        <span>Current: {Math.round(overallMarks)}%</span>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm w-fit">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
        <span>Predicted: {Math.round(Number(predictedScore))}%</span>
      </div>
    </div>
  </div>

  {/* Right Chart */}
  <div className="w-1/2 flex flex-col">
    <LearningProgressChart
      datasets={overallGraderData.datasets}
      config={overallGraderData.config}
      height={overallGraderData.height}
    />
     <div className="flex items-center flex-col sm:flex-row sm:justify-around gap-4 mt-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-100 text-red-700 border border-red-200 shadow-sm w-fit">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
        <span>Current: {api?.current_grade_overall||0 }</span>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm w-fit">
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
        <span>Predicted: {api?.current_grade_overall||0 }</span>
      </div>
    </div>
  </div>
  
  
</div>


      {/* Subject Chart + Strongest/Weakest */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="basis-[75%] mt-6">
          <LearningProgressChart
            datasets={subjectChartData.datasets}
            config={subjectChartData.config}
            height={subjectChartData.height}
          />
        </div>

        <div className="flex flex-row lg:flex-col gap-6 w-full justify-center basis-[20%]">
          {/* Strongest Subject */}
          <div className="flex items-center gap-3 rounded-md border-1 border-green-500 bg-green-50 shadow-md px-2 py-2 w-fit text-xs sm:text-sm">
            <span className="text-green-600">
              <div className="font-semibold">Strongest Subject</div>
              <div className="mt-1">{api?.strongest_subject || "N/A"}</div>
            </span>
            <ArrowUp className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Weakest Subject */}
          <div className="flex items-center gap-3 rounded-md border-1 border-red-500 bg-red-50 shadow-md px-2 py-2 w-fit text-xs sm:text-sm">
            <span className="text-red-600">
              <div className="font-semibold">Weakest Subject</div>
              <div className="mt-1">{api?.weakest_subject || "N/A"}</div>
            </span>
            <ArrowDown className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Descriptive & Prescriptive */}
    <div className="flex flex-col md:flex-row items-stretch gap-6  mt-6 w-full">
  <div className="flex-1 rounded-lg shadow-md overflow-hidden flex flex-col w-full">
    <div className="bg-[#4472c4] text-white py-2 px-2 sm:px-3 font-semibold text-center text-sm sm:text-base">
      <span>Descriptive</span>
      <span className="block font-normal text-xs sm:text-sm">(Overall)</span>
    </div>

    {/* make the content area flex-1 so it fills remaining height */}
    <div className="bg-orange-100 p-3 sm:p-5 flex-1">
      <p className="text-sm sm:text-md">
        {sanitizeText(api?.descriptive_overall) || "No descriptive summary available."}
      </p>
    </div>
  </div>

  <div className="flex-1 rounded-lg shadow-md overflow-hidden flex flex-col w-full">
    <div className="bg-[#4472c4] text-white py-2 px-2 sm:px-3 font-semibold text-center text-sm sm:text-base">
      <span>Prescriptive</span>
      <span className="block font-normal text-xs sm:text-sm">(Overall)</span>
    </div>

    <div className="bg-orange-100 p-3 sm:p-5 flex-1">
      <p className="text-sm sm:text-md">
        {sanitizeText(api?.prescriptive_overall) || "No prescriptive summary available."}
      </p>
    </div>
  </div>
</div>


      {/* Attentive Chart */}
      <div className="mt-8 flex justify-center">
        <div className="w-full ">
          <LearningProgressChart
            height="400px"
            datasets={attentiveDatasets}
            config={attentiveConfig}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
  <div className="w-full">
    <LearningProgressChart
      height={learningCurve.height}
      datasets={learningCurve.datasets}
      config={learningCurve.config}
    />
  </div>
</div>
    </div>
  );
}




