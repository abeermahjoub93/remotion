import type React from "react";
import { random } from "remotion";
import { NUM } from "./fonts";
import { COLORS, EXCEL } from "./layout";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const GRID = "rgba(38,38,38,0.28)";
const HEAD = "rgba(217,217,217,0.95)"; // Sweet Grey

// One semi-transparent spreadsheet: column letters, row numbers, gridlines, some numbers
// in the cells and a selected cell. Content is deterministic per sheet (random(seed)).
export const ExcelSheet: React.FC<{ readonly index: number; readonly width: number; readonly height: number }> = ({ index, width, height }) => {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < EXCEL.rows; r++) {
    for (let c = 0; c < EXCEL.cols; c++) {
      if (random(`cell-${index}-${r}-${c}`) < 0.42) continue;
      const v = Math.floor(random(`val-${index}-${r}-${c}`) * 98000) + 1200;
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: EXCEL.rowHeader + c * EXCEL.colWidth,
            top: EXCEL.headerHeight + r * EXCEL.rowHeight,
            width: EXCEL.colWidth - 8,
            height: EXCEL.rowHeight,
            lineHeight: `${EXCEL.rowHeight}px`,
            textAlign: "right",
            fontFamily: NUM,
            fontWeight: 700,
            fontSize: 13,
            color: COLORS.charcoal,
          }}
        >
          {v.toLocaleString("en-US")}
        </div>,
      );
    }
  }
  const sel = { r: Math.floor(random(`sel-r-${index}`) * EXCEL.rows), c: Math.floor(random(`sel-c-${index}`) * EXCEL.cols) };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width,
        height,
        background: `rgba(255,255,255,${EXCEL.fill})`,
        border: `2px solid ${GRID}`,
        boxSizing: "border-box",
        overflow: "hidden",
        backgroundImage: `repeating-linear-gradient(90deg, ${GRID} 0 1px, transparent 1px ${EXCEL.colWidth}px), repeating-linear-gradient(0deg, ${GRID} 0 1px, transparent 1px ${EXCEL.rowHeight}px)`,
        backgroundPosition: `${EXCEL.rowHeader}px ${EXCEL.headerHeight}px`,
      }}
    >
      {/* column header row */}
      <div style={{ position: "absolute", left: 0, top: 0, width, height: EXCEL.headerHeight, background: HEAD, borderBottom: `1px solid ${GRID}` }}>
        {LETTERS.map((l, c) => (
          <div
            key={l}
            style={{
              position: "absolute",
              left: EXCEL.rowHeader + c * EXCEL.colWidth,
              width: EXCEL.colWidth,
              height: EXCEL.headerHeight,
              lineHeight: `${EXCEL.headerHeight}px`,
              textAlign: "center",
              borderLeft: `1px solid ${GRID}`,
              fontFamily: NUM,
              fontWeight: 700,
              fontSize: 14,
              color: COLORS.charcoal,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      {/* row number column */}
      <div style={{ position: "absolute", left: 0, top: EXCEL.headerHeight, width: EXCEL.rowHeader, height: height - EXCEL.headerHeight, background: HEAD, borderRight: `1px solid ${GRID}` }}>
        {Array.from({ length: EXCEL.rows }, (_, r) => (
          <div key={r} style={{ height: EXCEL.rowHeight, lineHeight: `${EXCEL.rowHeight}px`, textAlign: "center", borderTop: r ? `1px solid ${GRID}` : undefined, fontFamily: NUM, fontWeight: 700, fontSize: 13, color: COLORS.charcoal }}>
            {r + 1}
          </div>
        ))}
      </div>
      {cells}
      {/* selected cell */}
      <div
        style={{
          position: "absolute",
          left: EXCEL.rowHeader + sel.c * EXCEL.colWidth - 1,
          top: EXCEL.headerHeight + sel.r * EXCEL.rowHeight - 1,
          width: EXCEL.colWidth + 1,
          height: EXCEL.rowHeight + 1,
          border: `2px solid ${COLORS.green}`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
