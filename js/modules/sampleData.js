// Funciones relacionadas con los datos de ejemplo
import { saveToLocalStorage } from "./localStorage.js";

export function loadSampleData() {
  if (!isLocalStorageAvailable()) {
    showNotification(
      "El almacenamiento local no está disponible en este navegador",
      false
    );
    return;
  }

  const existingData = loadFromLocalStorage("apuestasTransactions");
  if (existingData && existingData.length > 0) {
    if (
      !confirm(
        "Ya existen datos guardados. ¿Desea reemplazarlos con datos de ejemplo?"
      )
    ) {
      return;
    }
  }

  const sampleData = [
    {
      fecha: "2025-01-01 11:29:38",
      tipo: "Ingreso",
      metodo: "PayPal",
      cantidad: -50,
      mes: "enero",
    },
    {
      fecha: "2025-01-18 18:57:56",
      tipo: "Retirada",
      metodo: "PayPal",
      cantidad: 480.89,
      mes: "enero",
    },
    {
      fecha: "2025-01-04 20:18:30",
      tipo: "Ingreso",
      metodo: "PayPal",
      cantidad: -50,
      mes: "enero",
    },
    {
      fecha: "2025-02-22 17:11:31",
      tipo: "Retirada",
      metodo: "PayPal",
      cantidad: 120,
      mes: "febrero",
    },
    {
      fecha: "2025-01-06 17:59:24",
      tipo: "Ingreso",
      metodo: "PayPal",
      cantidad: -50,
      mes: "enero",
    },
    {
      fecha: "2025-02-28 22:34:09",
      tipo: "Retirada",
      metodo: "PayPal",
      cantidad: 346,
      mes: "febrero",
    },
  ];

  if (saveToLocalStorage("apuestasTransactions", sampleData)) {
    showNotification("Datos de ejemplo cargados correctamente");

    if (typeof renderTransactionsTable === "function") {
      renderTransactionsTable();
    }
    if (typeof updateCharts === "function") {
      updateCharts();
    }
    if (typeof updateKPIs === "function") {
      updateKPIs();
    }

    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    showNotification("Error al guardar datos de ejemplo", false);
  }
}