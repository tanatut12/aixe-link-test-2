import * as d3 from "d3";
import type { IMedicalReading } from "../interfaces/index.js";

interface GridRow {
  category: string;
  name: string;
  parameterId: number;
  sortSeq: number;
  groupSortSeq: number;
  values: Map<string, IMedicalReading>;
}

interface FilterOptions {
  category: string;
  alertStatus: string;
}

export function renderMedicalGrid(
  readings: IMedicalReading[],
  containerId: string
): void {
  renderGrid(readings, containerId);
}

function renderGrid(readings: IMedicalReading[], containerId: string): void {
  const container = d3.select(`#${containerId}`);
  container.html("");

  if (readings.length === 0) {
    container
      .append("div")
      .style("padding", "40px")
      .style("text-align", "center")
      .style("color", "#9ca3af")
      .text("No data matches the selected filters");
    return;
  }

  const timePeriods = Array.from(
    new Set(readings.map((r) => r.ColumnDisplay))
  ).sort();

  const rowsMap = new Map<string, GridRow>();
  readings.forEach((reading) => {
    const key = `${reading.parameterId}-${reading.Name}`;
    if (!rowsMap.has(key)) {
      rowsMap.set(key, {
        category: reading.Category,
        name: reading.Name,
        parameterId: reading.parameterId,
        sortSeq: reading.SortSeq,
        groupSortSeq: reading.GroupSortSeq,
        values: new Map(),
      });
    }
    rowsMap.get(key)!.values.set(reading.ColumnDisplay, reading);
  });

  const rows = Array.from(rowsMap.values()).sort((a, b) => {
    if (a.groupSortSeq !== b.groupSortSeq) {
      return a.groupSortSeq - b.groupSortSeq;
    }
    return a.sortSeq - b.sortSeq;
  });

  const cellWidth = 100;
  const cellHeight = 55;
  const rowLabelWidth = 160;
  const headerHeight = 70;
  const categoryHeaderHeight = 32;

  let totalHeight = headerHeight;
  let currentCategory = "";
  rows.forEach((row) => {
    if (row.category !== currentCategory) {
      totalHeight += categoryHeaderHeight;
      currentCategory = row.category;
    }
    totalHeight += cellHeight;
  });

  const totalWidth = rowLabelWidth + timePeriods.length * cellWidth + 20;

  const svg = container
    .append("div")
    .attr("class", "grid-container")
    .append("svg")
    .attr("class", "vital-grid")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .append("text")
    .attr("x", 10)
    .attr("y", 30)
    .attr("class", "category-header")
    .style("font-size", "16px")
    .text("Patient Vital Signs");

  timePeriods.forEach((period, i) => {
    const cleanPeriod = period.replace(/\r\n/g, " ");
    svg
      .append("text")
      .attr("x", rowLabelWidth + i * cellWidth + cellWidth / 2)
      .attr("y", headerHeight - 15)
      .attr("class", "time-header")
      .attr("text-anchor", "middle")
      .text(cleanPeriod);
  });

  let currentY = headerHeight;
  currentCategory = "";

  rows.forEach((row) => {
    if (row.category !== currentCategory) {
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", currentY)
        .attr("width", totalWidth)
        .attr("height", categoryHeaderHeight)
        .attr("fill", "#f3f4f6")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);

      svg
        .append("text")
        .attr("x", 10)
        .attr("y", currentY + categoryHeaderHeight / 2 + 5)
        .attr("class", "category-header")
        .text(row.category);

      currentCategory = row.category;
      currentY += categoryHeaderHeight;
    }

    svg
      .append("text")
      .attr("x", 10)
      .attr("y", currentY + cellHeight / 2 + 5)
      .attr("class", "vital-name")
      .text(row.name);

    timePeriods.forEach((period, colIndex) => {
      const reading = row.values.get(period);
      const x = rowLabelWidth + colIndex * cellWidth;

      let cellClass = "grid-cell";
      if (reading && reading.Value) {
        cellClass += " has-value";
        if (reading.IsHighLimit) cellClass += " high-limit";
        else if (reading.IsLowLimit) cellClass += " low-limit";
        else if (reading.IsComment) cellClass += " has-comment";
        else cellClass += " normal";
      } else {
        cellClass += " empty-cell";
      }

      svg
        .append("rect")
        .attr("x", x)
        .attr("y", currentY)
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("class", cellClass);

      if (reading && reading.Value) {
        const valueY = currentY + cellHeight / 2 - 8;
        const rangeY = currentY + cellHeight / 2 + 8;
        const alertY = currentY + cellHeight / 2 + 22;

        svg
          .append("text")
          .attr("x", x + cellWidth / 2)
          .attr("y", valueY)
          .attr("class", "cell-value-large")
          .attr("text-anchor", "middle")
          .text(reading.Value);

        svg
          .append("text")
          .attr("x", x + cellWidth / 2)
          .attr("y", rangeY)
          .attr("class", "cell-range")
          .attr("text-anchor", "middle")
          .text(`${reading.MinRange}-${reading.MaxRange}`);

        if (reading.IsHighLimit) {
          svg
            .append("text")
            .attr("x", x + cellWidth / 2)
            .attr("y", alertY)
            .attr("class", "cell-alert high")
            .attr("text-anchor", "middle")
            .text("⚠ HIGH");
        } else if (reading.IsLowLimit) {
          svg
            .append("text")
            .attr("x", x + cellWidth / 2)
            .attr("y", alertY)
            .attr("class", "cell-alert low")
            .attr("text-anchor", "middle")
            .text("⚠ LOW");
        }
      }
    });

    currentY += cellHeight;
  });
}
