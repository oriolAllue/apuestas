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