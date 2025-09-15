import React from "react";

export type Column<T> = {
  key: string; // unique key for the column (field name)
  label: string; // header label
  width?: string; // optional width (e.g. "w-32" or "150px")
  render?: (row: T, rowIndex: number) => React.ReactNode; // optional cell renderer
  className?: string; // optional additional classes for the cell
  align?: "left" | "center" | "right";
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey?: string | ((row: T) => string | number);
  headerBg?: string; // CSS color or tailwind class fallback
  rowBg?: string; // CSS color or tailwind class fallback
  rowAltBg?: string; // alternate row background (zebra)
  hoverBg?: string; // hover background
  emptyText?: string;
  onRowClick?: (row: T, idx: number) => void;
  className?: string;
};

/**
 * Reusable Table component for LMS (students-focused)
 * - Typescript generic
 * - Tailwind friendly (you can pass colors as tailwind classes or hex colors)
 * - Accessible table markup
 */
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey = (r: any) => r.id ?? JSON.stringify(r),
  headerBg = "#0f172a", // default: slate-900 like a dark navbar
  rowBg = "#ffffff",
  rowAltBg = "#f8fafc",
  hoverBg = "#eef2ff",
  emptyText = "No records found",
  onRowClick,
  className = "",
}: TableProps<T>) {
  const resolveKey = (row: T, idx: number) => {
    if (typeof rowKey === "function") return String(rowKey(row));
    return String((row as any)[rowKey] ?? idx);
  };

  const headerStyle = headerBg.startsWith("#")
    ? { backgroundColor: headerBg }
    : {}; // if it's a tailwind class, we'll add to className instead

  const rowStyle = (isAlt = false) =>
    (rowBg.startsWith("#") || (isAlt && rowAltBg && rowAltBg.startsWith("#")))
      ? { backgroundColor: isAlt && rowAltBg ? rowAltBg : rowBg }
      : {};

  const headerClassFromBg = headerBg.startsWith("#") ? "" : headerBg;
  const rowClassFromBg = rowBg.startsWith("#") ? "" : rowBg;
  const rowAltClassFromBg = rowAltBg && rowAltBg.startsWith("#") ? "" : rowAltBg;
  const hoverClassFromBg = hoverBg && hoverBg.startsWith("#") ? "" : hoverBg;

  return (
    <div className={`w-full overflow-auto rounded-lg shadow-sm ${className}`}>
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead>
          <tr
            className={`${headerClassFromBg} text-black text-left select-none`}
            style={headerStyle}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 font-medium text-xs uppercase tracking-wide ${col.className ?? ""} ${
                  col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                } ${col.width ?? ""}`}
                style={{ verticalAlign: "middle" }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const isAlt = idx % 2 === 1;
              const rKey = resolveKey(row, idx);
              const inlineStyle = rowStyle(isAlt);

              const rowClass = `${rowClassFromBg} ${isAlt ? rowAltClassFromBg : ""} hover:cursor-pointer ${
                hoverClassFromBg ? `hover:${hoverClassFromBg}` : "hover:bg-gray-50"
              }`.trim();

              return (
                <tr
                  key={rKey}
                  className={rowClass}
                  style={inlineStyle}
                  onClick={() => onRowClick && onRowClick(row, idx)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 align-middle whitespace-nowrap ${col.className ?? ""} ${
                        col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* small footer for counts - useful in LMS */}
      <div className="px-4 py-2 text-xs text-gray-500">
        Showing <strong>{data.length}</strong> {data.length === 1 ? "record" : "records"}
      </div>
    </div>
  );
}


