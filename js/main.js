// Archivo principal para inicializar y coordinar módulos
import { applyTableFilters, clearTableFilters, filterTable } from "./modules/tableFilters.js";
import { sortTable, setupSorting } from "./modules/tableSorting.js";
import { saveToLocalStorage, loadFromLocalStorage } from "./modules/localStorage.js";
import { loadSampleData } from "./modules/sampleData.js";

// Inicialización de eventos y configuración
window.addEventListener("DOMContentLoaded", () => {
  setupSorting();

  document.getElementById("apply-filters-btn").addEventListener("click", applyTableFilters);
  document.getElementById("clear-filters-btn").addEventListener("click", clearTableFilters);
  document.getElementById("load-sample-data-btn").addEventListener("click", loadSampleData);
});

// Ensure only one tab content is visible at a time
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // Hide all tab contents
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show the selected tab content
      tabContents[index].classList.add("active");
    });
  });
}

// Initialize tabs
setupTabs();