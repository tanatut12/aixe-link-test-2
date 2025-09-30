import type { IMedicalReading } from "../interfaces/index.js";

interface FilterOptions {
  category: string;
  alertStatus: string;
}

let currentFilters: FilterOptions = {
  category: "all",
  alertStatus: "all",
};

let filterChangeCallback: (() => void) | null = null;

export function setupFilterManager(
  readings: IMedicalReading[],
  onChange: () => void
): void {
  filterChangeCallback = onChange;

  const categories = Array.from(
    new Set(readings.map((r) => r.Category))
  ).sort();

  const categorySelect = document.getElementById(
    "categoryFilter"
  ) as HTMLSelectElement;
  if (categorySelect && categorySelect.options.length === 1) {
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    categorySelect.addEventListener("change", () => {
      currentFilters.category = categorySelect.value;
      if (filterChangeCallback) filterChangeCallback();
    });
  }

  const alertSelect = document.getElementById(
    "alertFilter"
  ) as HTMLSelectElement;
  if (alertSelect) {
    const existingListener = (alertSelect as any)._filterListener;
    if (!existingListener) {
      const listener = () => {
        currentFilters.alertStatus = alertSelect.value;
        if (filterChangeCallback) filterChangeCallback();
      };
      alertSelect.addEventListener("change", listener);
      (alertSelect as any)._filterListener = listener;
    }
  }
}

export function applyFiltersToData(
  readings: IMedicalReading[]
): IMedicalReading[] {
  let filtered = readings;

  if (currentFilters.category !== "all") {
    filtered = filtered.filter((r) => r.Category === currentFilters.category);
  }

  if (currentFilters.alertStatus === "alerts") {
    filtered = filtered.filter((r) => r.IsHighLimit || r.IsLowLimit);
  } else if (currentFilters.alertStatus === "normal") {
    filtered = filtered.filter((r) => !r.IsHighLimit && !r.IsLowLimit);
  }

  return filtered;
}
