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

// Tab switching logic
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to the clicked tab and corresponding content
      tab.classList.add("active");
      tabContents[index].classList.add("active");
    });
  });
}

// Initialize tabs
setupTabs();