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

document.addEventListener("DOMContentLoaded", () => {
  const credentialsFileInput = document.getElementById("credentials-file");
  const cryptoFileInput = document.getElementById("crypto-file");
  const encryptBtn = document.getElementById("encrypt-btn");
  const decryptBtn = document.getElementById("decrypt-btn");
  const cryptoActions = document.getElementById("crypto-actions");

  let cryptoKey = null;

  // Manejar la carga del archivo de credenciales
  credentialsFileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Por favor, selecciona un fichero de credenciales válido.");
      return;
    }

    try {
      const credentials = await loadCredentialsFromFile(file);
      cryptoKey = await importKey(credentials); // Importar clave desde credenciales

      // Habilitar acciones de encriptar/desencriptar
      cryptoActions.style.display = "block";
      cryptoFileInput.disabled = false;
      encryptBtn.disabled = false;
      decryptBtn.disabled = false;

      alert("Credenciales cargadas correctamente.");
    } catch (error) {
      alert("Error al cargar las credenciales: " + error);
    }
  });

  // Manejar encriptación
  encryptBtn.addEventListener("click", async () => {
    if (!cryptoKey) {
      alert("Por favor, carga un fichero de credenciales primero.");
      return;
    }

    const file = cryptoFileInput.files[0];
    if (!file) {
      alert("Por favor, selecciona un fichero para encriptar.");
      return;
    }

    try {
      const encryptedContent = await handleFileUpload(file, cryptoKey, false);
      downloadFile(encryptedContent, "encrypted-credentials.json");
    } catch (error) {
      alert("Error al encriptar el fichero: " + error);
    }
  });

  // Manejar desencriptación
  decryptBtn.addEventListener("click", async () => {
    if (!cryptoKey) {
      alert("Por favor, carga un fichero de credenciales primero.");
      return;
    }

    const file = cryptoFileInput.files[0];
    if (!file) {
      alert("Por favor, selecciona un fichero para desencriptar.");
      return;
    }

    try {
      const decryptedContent = await handleFileUpload(file, cryptoKey, true);
      document.getElementById("crypto-output").textContent = decryptedContent;
    } catch (error) {
      alert("Error al desencriptar el fichero: " + error);
    }
  });
});