// // src/CommonComponents/LineGraph.tsx
// import React, { useEffect, useRef } from "react";
// import Chart from "chart.js/auto";
// import annotationPlugin from "chartjs-plugin-annotation";

// export interface DataPoint {
//   label: string;
//   value: number;
//   color?: string;
//   borderColor?: string;
// }

// export interface Dataset {
//   label?: string;
//   data: DataPoint[];
//   borderColor?: string;
//   backgroundColor?: string;
//   tension?: number;
//   fill?: boolean;
// }

// export interface ChartConfig {
//   title?: string;
//   xAxisLabel?: string;
//   yAxisLabel?: string;
//   stepSize?: number;
//   showLegend?: boolean;
//   showGrid?: boolean;
//   chartType?: "line" | "bar" | "radar";
//   thresholdLine?: number;
// }

// interface LearningProgressChartProps {
//   datasets: Dataset[];
//   config?: ChartConfig;
//   height?: string;
//   onButtonClick?: () => void;
//   buttonText?: string;
// }

// const defaultColors = [
//   { border: "rgb(59, 130, 246)", background: "rgba(59, 130, 246, 0.1)" },
//   { border: "rgb(34, 197, 94)", background: "rgba(34, 197, 94, 0.1)" },
//   { border: "rgb(239, 68, 68)", background: "rgba(239, 68, 68, 0.1)" },
//   { border: "rgb(245, 158, 11)", background: "rgba(245, 158, 11, 0.1)" },
//   { border: "rgb(168, 85, 247)", background: "rgba(168, 85, 247, 0.1)" },
// ];

// const defaultPointColors = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6"];

// // register annotation plugin (no-op if already registered)
// try {
//   if ((Chart as any) && typeof (Chart as any).register === "function") {
//     (Chart as any).register(annotationPlugin);
//   }
// } catch (e) {
//   // swallow
// }

// const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
//   datasets = [],
//   config = {},
//   height = "300px",
//   onButtonClick,
//   buttonText = "How to improve",
// }) => {
//   const chartRef = useRef<HTMLCanvasElement | null>(null);
//   const chartInstance = useRef<Chart | null>(null);

//   const {
//     title = "Student Learning Progress",
//     xAxisLabel,
//     yAxisLabel,
//     stepSize = 10,
//     showLegend = datasets.length > 1,
//     showGrid = true,
//     chartType = "line",
//     thresholdLine,
//   } = config;

//   useEffect(() => {
//     const canvas = chartRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//       chartInstance.current = null;
//     }

//     const chartDatasets = datasets.map((dataset, datasetIndex) => {
//       const colorIndex = datasetIndex % defaultColors.length;
//       const defaultColor = defaultColors[colorIndex];

//       return {
//         label: dataset.label,
//         data: dataset.data.map((p) => p.value),
//         borderColor: dataset.borderColor || defaultColor.border,
//         backgroundColor:
//           dataset.backgroundColor !== undefined
//             ? dataset.backgroundColor
//             : "transparent",
//         tension: dataset.tension ?? 0.4,
//         pointBackgroundColor: dataset.data.map(
//           (point, idx) => point.color || defaultPointColors[idx % defaultPointColors.length]
//         ),
//         pointBorderColor: dataset.data.map(
//           (point, idx) => point.borderColor || point.color || defaultPointColors[idx % defaultPointColors.length]
//         ),
//         pointRadius: 4,
//         pointHoverRadius: 8,
//         fill: dataset.fill !== undefined ? dataset.fill : false,
//         borderWidth: 3,
//       } as any;
//     });

//     const labels = datasets[0]?.data?.map((p) => p.label) || [];

//     const annotationSection =
//       typeof thresholdLine === "number"
//         ? {
//             annotations: {
//               threshold: {
//                 type: "line" as const,
//                 yMin: thresholdLine,
//                 yMax: thresholdLine,
//                 borderColor: "rgba(239,68,68,0.85)",
//                 borderWidth: 2,
//                 borderDash: [6, 6],
//                 label: {
//                   display: true,
//                   content: [`Threshold: ${thresholdLine}%`],
//                   position: "end" as const,
//                   enabled: true,
//                   color: "#374151",
//                   backgroundColor: "rgba(255,255,255,0.8)",
//                   padding: { top: 6, bottom: 6, left: 8, right: 8 },
//                 },
//               },
//             },
//           }
//         : undefined;

//     chartInstance.current = new Chart(ctx, {
//       type: chartType,
//       data: {
//         labels,
//         datasets: chartDatasets,
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         layout: {
//           padding: {
//             top: 20,
//             bottom: 10,
//           },
//         },
//         plugins: {
//           legend: {
//             display: showLegend,
//             position: "top",
//             labels: {
//               color: "#6B7280",
//               usePointStyle: true,
//               padding: 20,
//             },
//           },
//           tooltip: {
//             callbacks: {
//               label: function (context: any) {
//                 const datasetLabel = context.dataset.label ?? "";
//                 const value = context.parsed.y;
//                 return `${datasetLabel}: ${value}`;
//               },
//             },
//           },
//           title: {
//             display: !!title,
//             text: title,
//             color: "#374151",
//             font: { size: 18, weight: "bold" },
//             padding: { top: 10, bottom: 20 },
//           },
//           ...(annotationSection ? { annotation: annotationSection } : {}),
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             min: 0,
//             max: 100,
//             ticks: {
//               stepSize,
//               color: "#6B7280",
//             },
//             grid: {
//               display: showGrid,
//               color: "rgba(107, 114, 128, 0.2)",
//             },
//             title: {
//               display: !!yAxisLabel,
//               text: yAxisLabel,
//               color: "#6B7280",
//             },
//           },
//           x: {
//             ticks: {
//               color: "#6B7280",
//               font: { size: 10 },
//             },
//             grid: {
//               display: showGrid && chartType !== "line",
//               color: "rgba(107, 114, 128, 0.2)",
//             },
//             title: {
//               display: !!xAxisLabel,
//               text: xAxisLabel,
//               color: "#6B7280",
//             },
//           },
//         },
//       },
//     });

//     return () => {
//       chartInstance.current?.destroy();
//       chartInstance.current = null;
//     };
//   }, [datasets, config, chartType, height, thresholdLine]);

//   return (
//     <div className="bg-white rounded-lg shadow-md">
//       <div className="relative">
//         <div className="bg-gray-50 rounded-lg p-4 mb-4" style={{ height }}>
//           <canvas ref={chartRef} />
//         </div>

//         {onButtonClick && (
//           <div className="text-center">
//             <button
//               onClick={onButtonClick}
//               className="bg-blue-500 text-white px-2 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors w-full"
//             >
//               {buttonText}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LearningProgressChart;
// export { LearningProgressChart as LineGraph };

// src/CommonComponents/LineGraph.tsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

// export interface DataPoint {
//   label: string;
//   value: number;
//   color?: string;
//   borderColor?: string;
// }

// export interface Dataset {
//   label?: string;
//   data: DataPoint[];
//   borderColor?: string;
//   backgroundColor?: string;
//   tension?: number;
//   fill?: boolean;
// }

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
  borderColor?: string;
}

export interface Dataset {
  label?: string;
  data: DataPoint[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
  fill?: boolean;

  // ---- additional Chart.js rendering props (optional) ----
  pointRadius?: number | number[];        // single number or per-point array
  pointHoverRadius?: number | number[];
  pointBackgroundColor?: string | string[]; // already supported logically
  pointBorderColor?: string | string[];
  borderWidth?: number;
  cubicInterpolationMode?: "default" | "monotone";
  spanGaps?: boolean;
  order?: number;
  // ...add any other Chart.js dataset props you plan to use
}


export interface ChartConfig {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  stepSize?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  chartType?: "line" | "bar" | "radar";
  thresholdLine?: number;
  // optional overrides for y axis
  yMin?: number;
  yMax?: number;
  // legacy simple props (kept for compatibility)
  // stepSize is already present
}

interface LearningProgressChartProps {
  datasets: Dataset[];
  config?: ChartConfig;
  height?: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

const defaultColors = [
  { border: "rgb(59, 130, 246)", background: "rgba(59, 130, 246, 0.1)" },
  { border: "rgb(34, 197, 94)", background: "rgba(34, 197, 94, 0.1)" },
  { border: "rgb(239, 68, 68)", background: "rgba(239, 68, 68, 0.1)" },
  { border: "rgb(245, 158, 11)", background: "rgba(245, 158, 11, 0.1)" },
  { border: "rgb(168, 85, 247)", background: "rgba(168, 85, 247, 0.1)" },
];

const defaultPointColors = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6"];

// register annotation plugin (no-op if already registered)
try {
  if ((Chart as any) && typeof (Chart as any).register === "function") {
    (Chart as any).register(annotationPlugin);
  }
} catch (e) {
  // swallow
}

const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  datasets = [],
  config = {},
  height = "300px",
  onButtonClick,
  buttonText = "How to improve",
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const {
    title = "Student Learning Progress",
    xAxisLabel,
    yAxisLabel,
    stepSize = 10,
    showLegend = datasets.length > 1,
    showGrid = true,
    chartType = "line",
    thresholdLine,
  } = config;

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const chartDatasets = datasets.map((dataset, datasetIndex) => {
      const colorIndex = datasetIndex % defaultColors.length;
      const defaultColor = defaultColors[colorIndex];

      return {
        label: dataset.label,
        data: dataset.data.map((p) => p.value),
        borderColor: dataset.borderColor || defaultColor.border,
        backgroundColor:
          dataset.backgroundColor !== undefined
            ? dataset.backgroundColor
            : "transparent",
        tension: dataset.tension ?? 0.4,
        pointBackgroundColor: dataset.data.map(
          (point, idx) => point.color || defaultPointColors[idx % defaultPointColors.length]
        ),
        pointBorderColor: dataset.data.map(
          (point, idx) => point.borderColor || point.color || defaultPointColors[idx % defaultPointColors.length]
        ),
        pointRadius: 4,
        pointHoverRadius: 8,
        fill: dataset.fill !== undefined ? dataset.fill : false,
        borderWidth: 3,
      } as any;
    });

    const labels = datasets[0]?.data?.map((p) => p.label) || [];

    const annotationSection =
      typeof thresholdLine === "number"
        ? {
            annotations: {
              threshold: {
                type: "line" as const,
                yMin: thresholdLine,
                yMax: thresholdLine,
                borderColor: "rgba(239,68,68,0.85)",
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  display: true,
                  content: [`Threshold: ${thresholdLine}%`],
                  position: "end" as const,
                  enabled: true,
                  color: "#374151",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  padding: { top: 6, bottom: 6, left: 8, right: 8 },
                },
              },
            },
          }
        : undefined;

    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: chartDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 10,
          },
        },
        plugins: {
          legend: {
            display: showLegend,
            position: "top",
            labels: {
              color: "#6B7280",
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const datasetLabel = context.dataset.label ?? "";
                const value = context.parsed.y;
                return `${datasetLabel}: ${value}`;
              },
            },
          },
          title: {
            display: !!title,
            text: title,
            color: "#374151",
            font: { size: 18, weight: "bold" },
            padding: { top: 10, bottom: 20 },
          },
          ...(annotationSection ? { annotation: annotationSection } : {}),
        },
        scales: {
          y: {
            // Respect per-chart overrides if provided, otherwise use previous defaults (0..100)
            beginAtZero: typeof (config as any).yMin === "number" ? false : true,
            min: typeof (config as any).yMin === "number" ? (config as any).yMin : 0,
            max: typeof (config as any).yMax === "number" ? (config as any).yMax : 100,
            ticks: {
              stepSize: typeof (config as any).stepSize === "number" ? (config as any).stepSize : stepSize,
              color: "#6B7280",
            },
            grid: {
              display: showGrid,
              color: "rgba(107, 114, 128, 0.2)",
            },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: "#6B7280",
            },
          },
          x: {
            ticks: {
              color: "#6B7280",
              font: { size: 10 },
            },
            grid: {
              display: showGrid && chartType !== "line",
              color: "rgba(107, 114, 128, 0.2)",
            },
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: "#6B7280",
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [datasets, config, chartType, height, thresholdLine]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="relative">
        <div className="bg-gray-50 rounded-lg p-4 mb-4" style={{ height }}>
          <canvas ref={chartRef} />
        </div>

        {onButtonClick && (
          <div className="text-center">
            <button
              onClick={onButtonClick}
              className="bg-blue-500 text-white px-2 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors w-full"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgressChart;
export { LearningProgressChart as LineGraph };

