import { fetchMedicalData } from "./actions/medic.data.action.js";
import type { IMedicalReading } from "./interfaces/index.js";

function renderMedicalData(readings: IMedicalReading[]): void {
  const container = document.getElementById("medicalData");
  if (!container) return;

  container.innerHTML = `<pre>${JSON.stringify(readings, null, 2)}</pre>`;
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
  loadMedicalDataOnMount();
  console.log("✨ TypeScript app initialized!");
});
