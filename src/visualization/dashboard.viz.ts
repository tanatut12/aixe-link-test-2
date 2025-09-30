import * as d3 from "d3";
import type { IMedicalReading } from "../interfaces/index.js";

interface ParameterData {
  parameterId: number;
  category: string;
  name: string;
  minRange: number;
  maxRange: number;
  data: { time: string; value: number; reading: IMedicalReading }[];
}

export function renderDashboard(
  readings: IMedicalReading[],
  containerId: string
): void {
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

  const parameters = prepareChartData(readings);
  const categories = Array.from(new Set(parameters.map((p) => p.category)));

  const containerDiv = container
    .append("div")
    .attr("class", "dashboard-container");

  categories.forEach((category) => {
    const categoryParams = parameters.filter((p) => p.category === category);

    const categoryDiv = containerDiv
      .append("div")
      .attr("class", "dashboard-category");

    categoryDiv
      .append("h3")
      .attr("class", "dashboard-category-title")
      .text(category);

    categoryParams.forEach((param) => {
      renderChart(categoryDiv, param);
    });
  });
}

function prepareChartData(readings: IMedicalReading[]): ParameterData[] {
  const paramMap = new Map<number, ParameterData>();

  readings.forEach((reading) => {
    if (!paramMap.has(reading.parameterId)) {
      paramMap.set(reading.parameterId, {
        parameterId: reading.parameterId,
        category: reading.Category,
        name: reading.Name,
        minRange: reading.MinRange,
        maxRange: reading.MaxRange,
        data: [],
      });
    }

    if (reading.Value) {
      const param = paramMap.get(reading.parameterId)!;
      param.data.push({
        time: reading.ColumnDisplay.replace(/\r\n/g, " "),
        value: parseFloat(reading.Value),
        reading: reading,
      });
    }
  });

  return Array.from(paramMap.values())
    .filter((p) => p.data.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderChart(
  container: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  param: ParameterData
): void {
  const chartDiv = container.append("div").attr("class", "chart-container");

  chartDiv.append("h4").attr("class", "chart-title").text(param.name);

  const width = 650;
  const height = 250;
  const margin = { top: 20, right: 30, bottom: 80, left: 60 };

  const svg = chartDiv
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart-svg");

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scalePoint()
    .domain(param.data.map((d) => d.time))
    .range([0, chartWidth])
    .padding(0.5);

  const yMin = Math.min(
    param.minRange,
    d3.min(param.data, (d) => d.value) || 0
  );
  const yMax = Math.max(
    param.maxRange,
    d3.max(param.data, (d) => d.value) || 0
  );
  const yPadding = (yMax - yMin) * 0.1;

  const yScale = d3
    .scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([chartHeight, 0]);

  g.append("rect")
    .attr("x", 0)
    .attr("y", yScale(param.maxRange))
    .attr("width", chartWidth)
    .attr("height", yScale(param.minRange) - yScale(param.maxRange))
    .attr("fill", "#e0f2fe")
    .attr("opacity", 0.3);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale(param.maxRange))
    .attr("y2", yScale(param.maxRange))
    .attr("stroke", "#3b82f6")
    .attr("stroke-dasharray", "4,4")
    .attr("opacity", 0.5);

  g.append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale(param.minRange))
    .attr("y2", yScale(param.minRange))
    .attr("stroke", "#3b82f6")
    .attr("stroke-dasharray", "4,4")
    .attr("opacity", 0.5);

  const line = d3
    .line<{ time: string; value: number }>()
    .x((d) => xScale(d.time)!)
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  g.append("path")
    .datum(param.data)
    .attr("fill", "none")
    .attr("stroke", "#667eea")
    .attr("stroke-width", 2)
    .attr("d", line);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  g.selectAll(".dot")
    .data(param.data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.time)!)
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 5)
    .attr("fill", (d) => {
      if (d.reading.IsHighLimit) return "#ef4444";
      if (d.reading.IsLowLimit) return "#3b82f6";
      return "#667eea";
    })
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 7);

      let tooltipContent = `<div class="tooltip-label">${param.name}</div>`;
      tooltipContent += `Time: ${d.time}<br/>`;
      tooltipContent += `Value: ${d.value}<br/>`;
      tooltipContent += `Range: ${param.minRange} - ${param.maxRange}`;

      if (d.reading.Comment) {
        tooltipContent += `<br/>Comment: ${d.reading.Comment}`;
      }

      if (d.reading.IsHighLimit || d.reading.IsLowLimit) {
        tooltipContent += `<div class="tooltip-alert">`;
        if (d.reading.IsHighLimit) tooltipContent += `Alert: High Limit`;
        if (d.reading.IsLowLimit) tooltipContent += `Alert: Low Limit`;
        tooltipContent += `</div>`;
      }

      tooltip.transition().duration(150).style("opacity", 1);
      tooltip
        .html(tooltipContent)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5);
      tooltip.transition().duration(150).style("opacity", 0);
    });

  const xAxis = d3.axisBottom(xScale);
  g.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .style("text-anchor", "end")
    .style("font-size", "10px");

  const yAxis = d3.axisLeft(yScale);
  g.append("g").call(yAxis);

  g.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 65)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#6b7280")
    .style("font-weight", "500")
    .text("Time");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "#6b7280")
    .text("Value");
}
