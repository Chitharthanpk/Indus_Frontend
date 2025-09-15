// import { Chart } from "chart.js";
// import { useEffect, useRef } from "react";

// const MiniChart = ({
//   currentScore,
//   predictedScore,
//   color,
//   maxY = 110,
//   labels = ['Start', 'Current', 'Predicted'],
//   customData,
//   stepSize, // new prop
// }: any) => {
//   const chartRef = useRef<HTMLCanvasElement>(null);
//   const chartInstance = useRef<Chart | null>(null);

//   useEffect(() => {
//     const canvas = chartRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }

//       const dataPoints = customData || [0, currentScore, predictedScore, 100];

//       chartInstance.current = new Chart(ctx, {
//         type: "line",
//         data: {
//           labels,
//           datasets: [
//             {
//               data: dataPoints,
//               borderColor: color,
//               backgroundColor: `${color}20`,
//               tension: 0.4,
//               pointBackgroundColor: ["#6B7280", "#EF4444", "#F59E0B", "#10B981"],
//               pointRadius: 5,
//               fill: true,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: { legend: { display: false } },
//           scales: {
//             y: {
//               beginAtZero: true,
//               max: maxY,
//               ticks: { font: { size: 9 }, stepSize: stepSize }, // <-- apply stepSize
//               grid: { color: "rgba(107, 114, 128, 0.1)" },
//             },
//             x: {
//               ticks: { font: { size: 8 } },
//               grid: { display: false },
//             },
//           },
//         },
//       });
//     }

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, [currentScore, predictedScore, color, maxY, labels, customData, stepSize]);

//   return <canvas ref={chartRef} />;
// };
// export default MiniChart


// src/CommonComponents/MiniChart.tsx
import React, { useEffect, useRef } from "react";

/* runtime (value) imports from chart.js */
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

/* type-only imports required when verbatimModuleSyntax is enabled */
import type { ChartOptions, Plugin, ChartType } from "chart.js";

/* register controllers/elements (runtime) */
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

/**
 * Module augmentation placed in-file so TypeScript accepts options.plugins.threshold.
 * We use ChartType (a type) inside the declaration; that's fine because we imported it as type.
 */
declare module "chart.js" {
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    threshold?: {
      value?: number;
      color?: string;
      label?: string;
      labelColor?: string;
      lineWidth?: number;
      font?: string;
      dash?: number[]; // optional dash pattern
    };
  }
}

export interface MiniChartProps {
  currentScore?: number;
  predictedScore?: number;
  color?: string;
  maxY?: number;
  labels?: string[];
  customData?: number[];
  stepSize?: number;

  // threshold props
  threshold?: number; // y-value where the horizontal line is drawn
  thresholdColor?: string;
  thresholdLabel?: string;
  thresholdLabelColor?: string;
  thresholdLineWidth?: number;
  thresholdFont?: string; // e.g. "12px sans-serif"
  thresholdDash?: number[]; // e.g. [6,4]
  // canvas style
  style?: React.CSSProperties;
  className?: string;
}

const MiniChart: React.FC<MiniChartProps> = ({
  currentScore = 0,
  predictedScore = 0,
  color = "#10B981",
  maxY = 110,
  labels,
  customData,
  stepSize,
  threshold,
  thresholdColor = "#ef4444",
  thresholdLabel,
  thresholdLabelColor,
  thresholdLineWidth = 1,
  thresholdFont = "12px sans-serif",
  thresholdDash = [6, 4],
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // destroy existing chart to avoid duplicates
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // build data
    const dataPoints = Array.isArray(customData) ? customData : [0, currentScore, predictedScore, 100];

    // ensure labels length matches data length: if labels provided but mismatch, fallback to generated labels
    const finalLabels =
      Array.isArray(labels) && labels.length === dataPoints.length
        ? labels
        : dataPoints.map((_, i) => `P${i}`);

    // inline plugin to draw a horizontal threshold line using options.plugins.threshold
    const thresholdPlugin: Plugin<"line"> = {
      id: "thresholdLine",
      afterDraw: (chart) => {
        // read runtime config (augmentation makes this valid for TS)
        const cfg = (chart.options.plugins as any)?.threshold;
        const value = cfg?.value;
        if (typeof value !== "number") return;

        const yScale = (chart.scales as any)?.y;
        if (!yScale) return;
        const chartArea = chart.chartArea;
        if (!chartArea) return;

        const y = yScale.getPixelForValue(value);

        const ctx = chart.ctx;
        ctx.save();

        // dashed line
        if (Array.isArray(cfg?.dash) && cfg.dash.length) {
          ctx.setLineDash(cfg.dash);
        } else {
          ctx.setLineDash(thresholdDash);
        }

        ctx.lineWidth = cfg?.lineWidth ?? thresholdLineWidth;
        ctx.strokeStyle = cfg?.color ?? thresholdColor;

        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // optional label
        if (cfg?.label) {
          const text = `${cfg.label} (${value})`;
          ctx.font = cfg.font ?? thresholdFont;
          ctx.fillStyle = cfg.labelColor ?? cfg.color ?? thresholdLabelColor ?? thresholdColor;
          const padding = 6;
          const textWidth = ctx.measureText(text).width;
          // place near right edge inside chart area
          const tx = Math.max(chartArea.left + padding, chartArea.right - textWidth - padding);
          const ty = Math.max(12, y - 6); // slightly above the line
          ctx.fillText(text, tx, ty);
        }

        ctx.restore();
      },
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        // This `threshold` property is accepted because of the augmentation above
        threshold: {
          value: threshold,
          color: thresholdColor,
          label: thresholdLabel,
          labelColor: thresholdLabelColor,
          lineWidth: thresholdLineWidth,
          font: thresholdFont,
          dash: thresholdDash,
        },
      } as any, // runtime cast: safe because plugin reads it dynamically
      scales: {
        y: {
          beginAtZero: true,
          max: maxY,
          ticks: { font: { size: 9 }, stepSize: stepSize },
          grid: { color: "rgba(107, 114, 128, 0.1)" },
        },
        x: {
          ticks: { font: { size: 8 } },
          grid: { display: false },
        },
      },
    };

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: finalLabels,
        datasets: [
          {
            data: dataPoints,
            borderColor: color,
            backgroundColor: `${color}20`, // expects hex like #RRGGBB
            tension: 0.4,
            pointBackgroundColor: dataPoints.map((_, i) => {
              if (i === 1) return "#EF4444";
              if (i === 2) return "#F59E0B";
              return "#6B7280";
            }),
            pointRadius: 5,
            fill: true,
          },
        ],
      },
      options,
      plugins: [thresholdPlugin],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [
    currentScore,
    predictedScore,
    color,
    maxY,
    labels,
    customData,
    stepSize,
    threshold,
    thresholdColor,
    thresholdLabel,
    thresholdLabelColor,
    thresholdLineWidth,
    thresholdFont,
    thresholdDash,
  ]);

  return <canvas ref={canvasRef} style={style} className={className} />;
};

export default MiniChart;




