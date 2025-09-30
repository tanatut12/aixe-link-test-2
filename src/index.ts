import { fetchMedicalData } from "./actions/medic.data.action.js";
import { renderMedicalGrid } from "./visualization/grid.viz.js";
import { renderDashboard } from "./visualization/dashboard.viz.js";
import {
  setupFilterManager,
  applyFiltersToData,
} from "./utils/filter.manager.js";
import type { IMedicalReading } from "./interfaces/index.js";

let currentView: "grid" | "dashboard" = "grid";
let currentData: IMedicalReading[] = [];
let allData: IMedicalReading[] = [];

function renderCurrentView(): void {
  const filtered = applyFiltersToData(allData);
  if (currentView === "grid") {
    renderMedicalGrid(filtered, "medicalData");
  } else {
    renderDashboard(filtered, "medicalData");
  }
}

function renderMedicalData(readings: IMedicalReading[]): void {
  allData = readings;
  currentData = readings;
  setupFilterManager(readings, renderCurrentView);
  renderCurrentView();
}

function setupViewToggle(): void {
  const gridBtn = document.getElementById("gridViewBtn");
  const dashboardBtn = document.getElementById("dashboardViewBtn");

  gridBtn?.addEventListener("click", () => {
    currentView = "grid";
    gridBtn.classList.add("active");
    dashboardBtn?.classList.remove("active");
    renderCurrentView();
  });

  dashboardBtn?.addEventListener("click", () => {
    currentView = "dashboard";
    dashboardBtn.classList.add("active");
    gridBtn?.classList.remove("active");
    renderCurrentView();
  });
}

async function loadMedicalDataOnMount(): Promise<void> {
  const container = document.getElementById("medicalData");
  if (!container) return;

  try {
    container.innerHTML = '<div class="loading">Loading medical data...</div>';
    const data = await fetchMedicalData();
    renderMedicalData(data);
  } catch (error) {
    container.innerHTML = `<div class="error">Failed to load medical data: ${
      error instanceof Error ? error.message : "Unknown error"
    }</div>`;
    console.error("Error loading medical data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupViewToggle();
  loadMedicalDataOnMount();
  console.log("✨ TypeScript app initialized!");
});
