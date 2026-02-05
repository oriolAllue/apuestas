// Variables para almacenar las instancias de gráficos
let monthlyChart,
  summaryChart,
  ratioChart,
  paymentMethodChart,
  weekdayChart,
  profitabilityChart;

// Variables para el estado de filtros y ordenación
let currentSort = {
  column: "fecha",
  direction: "desc"
};
let currentFilters = {
  month: "all",
  type: "all",
  method: "all",
  search: "",
};

// Función para aplicar filtros a la tabla
function applyTableFilters() {
  const monthFilter = document.getElementById("table-month-filter").value;
  const typeFilter = document.getElementById("table-type-filter").value;
  const methodFilter = document.getElementById("table-method-filter").value;
  const searchFilter = document
    .getElementById("table-search")
    .value.toLowerCase();

  // Guardar filtros actuales
  currentFilters = {
    month: monthFilter,
    type: typeFilter,
    method: methodFilter,
    search: searchFilter,
  };

  // Aplicar filtros
  filterTable();
}

// Función para limpiar todos los filtros
function clearTableFilters() {
  document.getElementById("table-month-filter").value = "all";
  document.getElementById("table-type-filter").value = "all";
  document.getElementById("table-method-filter").value = "all";
  document.getElementById("table-search").value = "";

  currentFilters = {
    month: "all",
    type: "all",
    method: "all",
    search: "",
  };

  filterTable();
}

// Función para filtrar la tabla
function filterTable() {
  const rows = document.querySelectorAll("#transactions-table tbody tr");
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  rows.forEach((row) => {
    const fecha = row.cells[0].textContent.toLowerCase();
    const tipo = row.cells[1].textContent.toLowerCase();
    const metodo = row.cells[2].textContent.toLowerCase();
    const cantidad = row.cells[3].textContent.toLowerCase();
    const mes = row.cells[4].textContent.toLowerCase();
    const casa = row.cells[5].textContent.toLowerCase();

    const monthNum = monthNames.indexOf(mes) + 1;

    // Aplicar filtros
    const matchesMonth =
      currentFilters.month === "all" ||
      monthNum.toString() === currentFilters.month;
    const matchesType =
      currentFilters.type === "all" || tipo === currentFilters.type;
    const matchesMethod =
      currentFilters.method === "all" || metodo === currentFilters.method;
    const matchesSearch =
      currentFilters.search === "" ||
      fecha.includes(currentFilters.search) ||
      tipo.includes(currentFilters.search) ||
      metodo.includes(currentFilters.search) ||
      cantidad.includes(currentFilters.search) ||
      mes.includes(currentFilters.search) ||
      casa.includes(currentFilters.search);

    // Mostrar u ocultar fila según los filtros
    row.style.display =
      matchesMonth && matchesType && matchesMethod && matchesSearch ?
      "" :
      "none";
  });

  // Ordenar después de filtrar
  sortTable(currentSort.column, currentSort.direction);
}

// Función para ordenar la tabla
function sortTable(column, direction) {
  const tbody = document.querySelector("#transactions-table tbody");
  const rows = Array.from(
    tbody.querySelectorAll('tr:not([style*="display: none"])')
  );

  rows.sort((a, b) => {
    let aValue = a.querySelector(
      `td:nth-child(${getColumnIndex(column)})`
    ).textContent;
    let bValue = b.querySelector(
      `td:nth-child(${getColumnIndex(column)})`
    ).textContent;

    // Convertir valores numéricos
    if (column === "cantidad") {
      aValue = parseFloat(aValue.replace("€", "").replace(",", "").trim());
      bValue = parseFloat(bValue.replace("€", "").replace(",", "").trim());
    }

    // Convertir fechas para ordenación
    if (column === "fecha") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Ordenar
    if (direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Limpiar y reordenar la tabla
  rows.forEach((row) => tbody.appendChild(row));

  // Actualizar indicadores de ordenación
  updateSortIndicators(column, direction);

  // Guardar ordenación actual
  currentSort = {
    column,
    direction
  };
}

// Función auxiliar para obtener índice de columna
function getColumnIndex(columnName) {
  const columns = {
    fecha: 1,
    tipo: 2,
    metodo: 3,
    cantidad: 4,
    mes: 5,
    casa: 6,
  };
  return columns[columnName] || 1;
}

// Función para actualizar indicadores visuales de ordenación
function updateSortIndicators(column, direction) {
  // Remover clases existentes
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.remove("asc", "desc");
  });

  // Añadir clases al encabezado actual
  const currentHeader = document.querySelector(`th[data-sort="${column}"]`);
  if (currentHeader) {
    currentHeader.classList.add(direction);
  }
}

// Función para manejar clics en encabezados de columna
function setupSorting() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const column = th.getAttribute("data-sort");
      const direction =
        currentSort.column === column && currentSort.direction === "asc" ?
        "desc" :
        "asc";
      sortTable(column, direction);
    });
  });
}
// Función para guardar datos en localStorage
function saveToLocalStorage() {
  localStorage.setItem("apuestasTransactions", JSON.stringify(transactions));
}

// Función para cargar datos desde localStorage
function loadFromLocalStorage() {
  const savedTransactions = localStorage.getItem("apuestasTransactions");

  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
}

// Función para cargar datos de ejemplo
function loadSampleData() {
  // Verificar si localStorage está disponible
  if (!isLocalStorageAvailable()) {
    showNotification(
      "El almacenamiento local no está disponible en este navegador",
      false
    );
    return;
  }

  // Verificar si ya existen datos
  const existingData = getStorageData("apuestasTransactions");
  if (existingData && existingData.length > 0) {
    if (
      !confirm(
        "Ya existen datos guardados. ¿Desea reemplazarlos con datos de ejemplo?"
      )
    ) {
      return;
    }
  }

  // Cargar datos de ejemplo
  const sampleData = [{
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

  // Guardar datos
  if (setStorageData("apuestasTransactions", sampleData)) {
    showNotification("Datos de ejemplo cargados correctamente");

    // Actualizar la interfaz
    if (typeof renderTransactionsTable === "function") {
      renderTransactionsTable();
    }
    if (typeof updateCharts === "function") {
      updateCharts();
    }
    if (typeof updateKPIs === "function") {
      updateKPIs();
    }

    // Recargar después de un breve delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    showNotification("Error al guardar datos de ejemplo", false);
  }
}

// Función para verificar la disponibilidad de localStorage
function isLocalStorageAvailable() {
  try {
    const test = "test";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Función segura para obtener datos
function getStorageData(key) {
  if (!isLocalStorageAvailable()) return null;

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error al obtener datos:", e);
    return null;
  }
}

// Función segura para guardar datos
function setStorageData(key, data) {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Error al guardar datos:", e);
    return false;
  }
}

// Función para exportar datos en formato CSV (sin columna Mes)
function exportData() {
  if (transactions.length === 0) {
    showNotification("No hay datos para exportar", false);
    return;
  }

  // Crear encabezados CSV en el formato correcto (sin Mes)
  const headers = [
    "Fecha",
    "Tipo",
    "Metodo",
    "Cantidad",
    "Casa",
    "Descripcion",
  ];
  let csvContent = headers.join(",") + "\n";

  // Añadir cada transacción
  transactions.forEach((transaction) => {
    // Para exportación, mostramos la cantidad absoluta (sin signo negativo)
    const cantidadExport = Math.abs(transaction.cantidad);

    const row = [
      `"${formatDateToStandard(transaction.fecha)}"`,
      `"${transaction.tipo}"`,
      `"${transaction.metodo}"`,
      cantidadExport,
      `"${transaction.casa || "Bet365"}"`,
      `"${transaction.descripcion || "No contiene"}"`,
    ];
    csvContent += row.join(",") + "\n";
  });

  // Crear el archivo para descargar
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `apuestas-data-${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification("Datos exportados en formato CSV correctamente");
}

// Función para calcular estadísticas de métodos de pago (con transacciones filtradas)
function calculatePaymentMethods(transactionsToUse = transactions) {
  const methods = {};

  transactionsToUse.forEach((transaction) => {
    if (!methods[transaction.metodo]) {
      methods[transaction.metodo] = 0;
    }
    methods[transaction.metodo]++;
  });

  return methods;
}

// Función para calcular estadísticas de días de la semana (con transacciones filtradas)
function calculateWeekdayStats(transactionsToUse = transactions) {
  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const stats = [0, 0, 0, 0, 0, 0, 0];

  transactionsToUse.forEach((transaction) => {
    try {
      const date = new Date(transaction.fecha);
      const day = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      stats[day]++;
    } catch (e) {
      console.error("Error parsing date:", transaction.fecha, e);
    }
  });

  return {
    labels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    data: stats,
  };
}

// Función para calcular estadísticas de días de la semana
function calculateWeekdayStats() {
  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const stats = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((transaction) => {
    try {
      const date = new Date(transaction.fecha);
      const day = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      stats[day]++;
    } catch (e) {
      console.error("Error parsing date:", transaction.fecha, e);
    }
  });

  return {
    labels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    data: stats,
  };
}

// Función para actualizar todos los KPIs
function updateKPIs() {
  // Calcular totales
  let totalIngresos = 0;
  let totalRetiradas = 0;
  let countIngresos = 0;
  let countRetiradas = 0;

  transactions.forEach((transaction) => {
    if (transaction.tipo.toLowerCase() === "ingreso") {
      totalIngresos += Math.abs(transaction.cantidad);
      countIngresos++;
    } else {
      totalRetiradas += transaction.cantidad;
      countRetiradas++;
    }
  });

  const balanceTotal = totalRetiradas - totalIngresos;

  // Calcular datos mensuales
  const monthlyData = calculateMonthlyData();

  // Encontrar mejor y peor mes
  let mejorMes = {
    nombre: "Ninguno",
    valor: -Infinity
  };
  let peorMes = {
    nombre: "Ninguno",
    valor: Infinity
  };

  for (const mes in monthlyData) {
    if (monthlyData[mes].total > mejorMes.valor) {
      mejorMes = {
        nombre: mes,
        valor: monthlyData[mes].total
      };
    }
    if (monthlyData[mes].total < peorMes.valor) {
      peorMes = {
        nombre: mes,
        valor: monthlyData[mes].total
      };
    }
  }

  // Calcular promedios
  const ingresoPromedio = countIngresos > 0 ? totalIngresos / countIngresos : 0;
  const retiradaPromedio =
    countRetiradas > 0 ? totalRetiradas / countRetiradas : 0;

  // Calcular método predominante
  const methodStats = calculatePaymentMethods();
  let metodoPredominante = "Ninguno";
  let maxCount = 0;
  let totalTransactions = transactions.length;

  for (const method in methodStats) {
    if (methodStats[method] > maxCount) {
      maxCount = methodStats[method];
      metodoPredominante = method;
    }
  }

  const porcentajeMetodo =
    totalTransactions > 0 ?
    ((maxCount / totalTransactions) * 100).toFixed(0) :
    0;

  // Calcular día con más actividad
  const weekdayStats = calculateWeekdayStats();
  let diaActivo = "Ninguno";
  let maxDia = 0;
  let maxDiaIndex = 0;

  weekdayStats.data.forEach((count, index) => {
    if (count > maxDia) {
      maxDia = count;
      maxDiaIndex = index;
    }
  });

  diaActivo = weekdayStats.labels[maxDiaIndex];

  // Actualizar DOM
  document.getElementById(
    "total-balance"
  ).textContent = `${balanceTotal.toFixed(2)} €`;
  document.getElementById("total-balance").className =
    balanceTotal >= 0 ? "value positive" : "value negative";

  document.getElementById(
    "total-ingresos"
  ).textContent = `${totalIngresos.toFixed(2)} €`;
  document.getElementById("ingresos-count").textContent = countIngresos;

  document.getElementById(
    "total-retiradas"
  ).textContent = `${totalRetiradas.toFixed(2)} €`;
  document.getElementById("retiradas-count").textContent = countRetiradas;

  if (mejorMes.nombre !== "Ninguno") {
    document.getElementById("mejor-mes").textContent = `${
      mejorMes.nombre.charAt(0).toUpperCase() + mejorMes.nombre.slice(1)
    } (+${mejorMes.valor.toFixed(2)} €)`;
    document.getElementById("peor-mes").textContent = `${
      peorMes.nombre.charAt(0).toUpperCase() + peorMes.nombre.slice(1)
    } (${peorMes.valor.toFixed(2)} €)`;
  }

  document.getElementById(
    "ingreso-promedio"
  ).textContent = `${ingresoPromedio.toFixed(2)} €`;
  document.getElementById(
    "retirada-promedio"
  ).textContent = `${retiradaPromedio.toFixed(2)} €`;

  document.getElementById("metodo-predominante").textContent =
    metodoPredominante;
  document.getElementById(
    "porcentaje-metodo"
  ).textContent = `${porcentajeMetodo}% de transacciones`;

  document.getElementById("dia-activo").textContent = diaActivo;
  document.getElementById(
    "transacciones-dia"
  ).textContent = `${maxDia} transacciones`;
}

// Datos iniciales basados en el Excel proporcionado
const initialTransactions = [{
    fecha: "2025-01-01 11:29",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -50,
    mes: "enero",
  },
  {
    fecha: "2025-01-18 18:57",
    tipo: "Retirada",
    metodo: "PayPal",
    cantidad: 480.89,
    mes: "enero",
  },
  {
    fecha: "2025-01-04 20:18",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -50,
    mes: "enero",
  },
  {
    fecha: "2025-02-22 17:11",
    tipo: "Retirada",
    metodo: "PayPal",
    cantidad: 120,
    mes: "febrero",
  },
  {
    fecha: "2025-01-06 17:59",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -50,
    mes: "enero",
  },
  {
    fecha: "2025-02-28 22:34",
    tipo: "Retirada",
    metodo: "PayPal",
    cantidad: 346,
    mes: "febrero",
  },
  {
    fecha: "2025-01-11 09:51",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-16 17:02",
    tipo: "Retirada",
    metodo: "PayPal",
    cantidad: 290,
    mes: "marzo",
  },
  {
    fecha: "2025-01-11 17:17",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-16 23:02",
    tipo: "Retirada",
    metodo: "PayPal",
    cantidad: 354.38,
    mes: "marzo",
  },
  {
    fecha: "2025-01-11 17:21",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-23 16:34",
    tipo: "Retirada",
    metodo: "Giro bancario",
    cantidad: 155,
    mes: "marzo",
  },
  {
    fecha: "2025-01-12 12:07",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-30 09:18",
    tipo: "Retirada",
    metodo: "Giro bancario",
    cantidad: 340.12,
    mes: "marzo",
  },
  {
    fecha: "2025-01-12 14:48",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-30 18:46",
    tipo: "Retirada",
    metodo: "Giro bancario",
    cantidad: 490,
    mes: "marzo",
  },
  {
    fecha: "2025-01-12 17:00",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-03-30 19:45",
    tipo: "Retirada",
    metodo: "Giro bancario",
    cantidad: 736.19,
    mes: "marzo",
  },
  {
    fecha: "2025-01-17 18:31",
    tipo: "Ingreso",
    metodo: "PayPal",
    cantidad: -100,
    mes: "enero",
  },
  {
    fecha: "2025-04-19 17:54",
    tipo: "Retirada",
    metodo: "Giro bancario",
    cantidad: 269.3,
    mes: "abril",
  },
];

// Variables globales para los datos
let transactions = [];

// Función para cambiar pestañas
function switchTab(tabName) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

     // Añade la clase 'active' a la pestaña seleccionada
  document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");

  // Si cambiamos a la pestaña de datos, actualizamos la tabla
  if (tabName === "data") {
    renderTransactionsTable();
  }

  // Si cambiamos a la pestaña de dashboard, actualizamos los gráficos con los filtros actuales
  if (tabName === "dashboard") {
    const monthFilter = document.getElementById("month-filter").value;
    const typeFilter = document.getElementById("type-filter").value;

    updateCharts({
      month: monthFilter,
      type: typeFilter,
    });
  }
  // Si cambiamos a la pestaña de análisis, inicializamos el análisis
  if (tabName === "analysis") {
    // Destruir gráficos existentes si es necesario
    if (profitabilityChart) {
      profitabilityChart.destroy();
      profitabilityChart = null;
    }

    initAnalysisTab();
    // Mostrar mensaje si no hay datos
    const noDataMsg = document.getElementById("noProfitabilityData");
    if (transactions.length === 0) {
      noDataMsg.style.display = "block";
    } else {
      noDataMsg.style.display = "none";
    }
  }
}

// Función para mostrar notificaciones
function showNotification(message, isSuccess = true) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = isSuccess ?
    "notification show" :
    "notification show error";

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
// Función para renderizar la tabla de transacciones ordenadas por fecha
function renderTransactionsTable() {
  const tableBody = document.querySelector("#transactions-table tbody");
  tableBody.innerHTML = "";

  // Ordenar transacciones según la ordenación actual
  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue, bValue;

    if (currentSort.column === "cantidad") {
      aValue = a.cantidad;
      bValue = b.cantidad;
    } else if (currentSort.column === "fecha") {
      aValue = new Date(a.fecha);
      bValue = new Date(b.fecha);
    } else {
      aValue = a[currentSort.column] || "";
      bValue = b[currentSort.column] || "";
    }

    if (currentSort.direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  sortedTransactions.forEach((transaction, index) => {
    const originalIndex = transactions.findIndex(
      (t) =>
      t.fecha === transaction.fecha &&
      t.tipo === transaction.tipo &&
      t.cantidad === transaction.cantidad
    );

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${transaction.fecha}</td>
            <td>${transaction.tipo}</td>
            <td>${transaction.metodo}</td>
            <td class="${
              transaction.cantidad < 0 ? "negative" : "positive"
            }">${transaction.cantidad.toFixed(2)} €</td>
            <td>${
              transaction.mes.charAt(0).toUpperCase() + transaction.mes.slice(1)
            }</td>
            <td>${transaction.casa || "Bet365"}</td>
            <td class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editTransaction(${originalIndex})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteTransaction(${originalIndex})"><i class="fas fa-trash"></i></button>
            </td>
        `;

    tableBody.appendChild(row);
  });

  // Aplicar filtros después de renderizar
  filterTable();

  // Actualizar indicadores de ordenación
  updateSortIndicators(currentSort.column, currentSort.direction);
}

// Función para eliminar una transacción
function deleteTransaction(index) {
  if (confirm("¿Está seguro de que desea eliminar esta transacción?")) {
    transactions.splice(index, 1);

    // Guardar en localStorage
    saveToLocalStorage();

    // Actualizar la interfaz
    renderTransactionsTable();
    updateCharts();
    updateKPIs();

    showNotification("Transacción eliminada correctamente");
  }
}

// Función para editar una transacción
function editTransaction(index) {
  // Aquí iría la lógica para editar una transacción
  showNotification("Funcionalidad de edición en desarrollo", false);
}

// Función para calcular datos mensuales a partir de las transacciones
function calculateMonthlyData() {
  // Inicializar datos mensuales
  const monthlyData = {
    enero: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    febrero: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    marzo: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    abril: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    mayo: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    junio: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    julio: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    agosto: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    septiembre: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    octubre: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    noviembre: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
    diciembre: {
      ingresos: 0,
      retiradas: 0,
      total: 0
    },
  };

  // Procesar cada transacción
  transactions.forEach((transaction) => {
    const mes = transaction.mes.toLowerCase();
    if (monthlyData[mes]) {
      if (transaction.tipo.toLowerCase() === "ingreso") {
        monthlyData[mes].ingresos += transaction.cantidad;
      } else {
        monthlyData[mes].retiradas += transaction.cantidad;
      }
      monthlyData[mes].total =
        monthlyData[mes].ingresos + monthlyData[mes].retiradas;
    }
  });

  return monthlyData;
}

// Función para actualizar gráficos con filtros opcionales
function updateCharts(filters = {}) {
  // Actualizar la hora de actualización
  document.getElementById("update-time").textContent =
    new Date().toLocaleTimeString();

  // Calcular datos mensuales (filtrados si es necesario)
  const monthlyData = calculateMonthlyData();

  // Obtener filtros
  const monthFilter =
    filters.month || document.getElementById("month-filter").value;
  const typeFilter =
    filters.type || document.getElementById("type-filter").value;

  // Filtrar transacciones si hay filtros activos
  let filteredTransactions = [...transactions];

  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  if (monthFilter !== "all") {
    const monthName = monthNames[parseInt(monthFilter) - 1];
    filteredTransactions = filteredTransactions.filter(
      (t) => t.mes.toLowerCase() === monthName
    );
  }

  if (typeFilter !== "all") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.tipo.toLowerCase() === typeFilter
    );
  }

  // Destruir gráficos existentes
  if (monthlyChart) monthlyChart.destroy();
  if (summaryChart) summaryChart.destroy();
  if (ratioChart) ratioChart.destroy();
  if (paymentMethodChart) paymentMethodChart.destroy();
  if (weekdayChart) weekdayChart.destroy();
  if (profitabilityChart) profitabilityChart.destroy();

  // Calcular datos para gráficos basados en transacciones filtradas
  const filteredMonthlyData =
    calculateFilteredMonthlyData(filteredTransactions);
  const paymentMethods = calculatePaymentMethods(filteredTransactions);
  const weekdayStats = calculateWeekdayStats(filteredTransactions);

  // Calcular totales para el gráfico de proporción
  let totalIngresos = 0;
  let totalRetiradas = 0;

  filteredTransactions.forEach((transaction) => {
    if (transaction.tipo.toLowerCase() === "ingreso") {
      totalIngresos += Math.abs(transaction.cantidad);
    } else {
      totalRetiradas += transaction.cantidad;
    }
  });

  // Determinar colores según el tema actual
  const isDarkMode =
    document.getElementById("dark-mode-switch")?.checked || false;
  const gridColor = isDarkMode ?
    "rgba(255, 255, 255, 0.1)" :
    "rgba(0, 0, 0, 0.05)";
  const textColor = isDarkMode ? "#e0e0e0" : "#666";

  // Gráfico de evolución mensual (mostrar todos los meses o solo el filtrado)
  const monthlyCtx = document.getElementById("monthlyChart").getContext("2d");
  monthlyChart = new Chart(monthlyCtx, {
    type: "line",
    data: {
      labels: monthFilter === "all" ?
        Object.keys(monthlyData) : [monthNames[parseInt(monthFilter) - 1]],
      datasets: [{
        label: "Balance Mensual",
        data: monthFilter === "all" ?
          Object.values(monthlyData).map((m) => m.total) : [filteredMonthlyData.total || 0],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        fill: true,
        tension: 0.3,
      }, ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
          },
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Datos de ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    },
  });

  // Gráfico de resumen por mes (mostrar todos los meses o solo el filtrado)
  const summaryCtx = document.getElementById("summaryChart").getContext("2d");
  summaryChart = new Chart(summaryCtx, {
    type: "bar",
    data: {
      labels: monthFilter === "all" ?
        Object.keys(monthlyData).filter(
          (m) =>
          monthlyData[m].ingresos !== 0 || monthlyData[m].retiradas !== 0
        ) : [monthNames[parseInt(monthFilter) - 1]],
      datasets: [{
          label: "Ingresos",
          data: monthFilter === "all" ?
            Object.values(monthlyData)
            .filter((m) => m.ingresos !== 0 || m.retiradas !== 0)
            .map((m) => Math.abs(m.ingresos)) : [Math.abs(filteredMonthlyData.ingresos) || 0],
          backgroundColor: "rgba(231, 76, 60, 0.7)",
        },
        {
          label: "Retiradas",
          data: monthFilter === "all" ?
            Object.values(monthlyData)
            .filter((m) => m.ingresos !== 0 || m.retiradas !== 0)
            .map((m) => m.retiradas) : [filteredMonthlyData.retiradas || 0],
          backgroundColor: "rgba(46, 204, 113, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
          },
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Resumen de ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    },
  });
  // Gráfico de proporción (usando datos filtrados)
  const ratioCtx = document.getElementById("ratioChart").getContext("2d");
  ratioChart = new Chart(ratioCtx, {
    type: "doughnut",
    data: {
      labels: ["Ingresos", "Retiradas"],
      datasets: [{
        data: [totalIngresos, totalRetiradas],
        backgroundColor: [
          "rgba(231, 76, 60, 0.7)",
          "rgba(46, 204, 113, 0.7)",
        ],
        borderWidth: 1,
        borderColor: isDarkMode ? "#2d2d2d" : "#fff",
      }, ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
          },
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Proporción en ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value.toFixed(2)} € (${percentage}%)`;
            },
          },
        },
      },
    },
  });

  // Gráfico de métodos de pago (usando datos filtrados)
  const paymentCtx = document
    .getElementById("paymentMethodChart")
    .getContext("2d");
  paymentMethodChart = new Chart(paymentCtx, {
    type: "pie",
    data: {
      labels: Object.keys(paymentMethods),
      datasets: [{
        data: Object.values(paymentMethods),
        backgroundColor: [
          "#3498db",
          "#e74c3c",
          "#2ecc71",
          "#f39c12",
          "#9b59b6",
          "#1abc9c",
          "#d35400",
          "#c0392b",
        ],
        borderWidth: 1,
        borderColor: isDarkMode ? "#2d2d2d" : "#fff",
      }, ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
          },
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Métodos en ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} transacciones (${percentage}%)`;
            },
          },
        },
      },
    },
  });
  // Gráfico de días de la semana (usando datos filtrados)
  const weekdayCtx = document.getElementById("weekdayChart").getContext("2d");
  weekdayChart = new Chart(weekdayCtx, {
    type: "bar",
    data: {
      labels: weekdayStats.labels,
      datasets: [{
        label: "Cantidad de transacciones",
        data: weekdayStats.data,
        backgroundColor: "rgba(52, 152, 219, 0.7)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
      }, ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Actividad por día en ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    },
  });
  // Gráfico de rentabilidad (usando datos filtrados)
  const profitabilityCtx = document
    .getElementById("profitabilityChart")
    .getContext("2d");

  // Calcular ROI para el mes filtrado o para todos los meses
  let profitabilityLabels, profitabilityData, profitabilityColors;

  if (monthFilter === "all") {
    // Todos los meses
    profitabilityLabels = Object.keys(monthlyData).filter(
      (m) => monthlyData[m].ingresos !== 0 || monthlyData[m].retiradas !== 0
    );
    profitabilityData = Object.values(monthlyData)
      .filter((m) => m.ingresos !== 0 || m.retiradas !== 0)
      .map((m) => {
        const ingresos = Math.abs(m.ingresos);
        if (ingresos === 0) return 0;
        return ((m.total / ingresos) * 100).toFixed(0);
      });
    profitabilityColors = Object.values(monthlyData)
      .filter((m) => m.ingresos !== 0 || m.retiradas !== 0)
      .map((m) => {
        return m.total >= 0 ?
          "rgba(46, 204, 113, 0.7)" :
          "rgba(231, 76, 60, 0.7)";
      });
  } else {
    // Mes específico
    const monthName = monthNames[parseInt(monthFilter) - 1];
    const monthData = filteredMonthlyData;
    const ingresos = Math.abs(monthData.ingresos);

    profitabilityLabels = [monthName];
    profitabilityData = [
      ingresos === 0 ? 0 : ((monthData.total / ingresos) * 100).toFixed(0),
    ];
    profitabilityColors = [
      monthData.total >= 0 ?
      "rgba(46, 204, 113, 0.7)" :
      "rgba(231, 76, 60, 0.7)",
    ];
  }

  profitabilityChart = new Chart(profitabilityCtx, {
    type: "bar",
    data: {
      labels: profitabilityLabels,
      datasets: [{
        label: "ROI (%)",
        data: profitabilityData,
        backgroundColor: profitabilityColors,
        borderWidth: 1,
      }, ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: monthFilter !== "all",
          text: monthFilter !== "all" ?
            `Rentabilidad en ${monthNames[parseInt(monthFilter) - 1]}` : "",
          color: textColor,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `ROI: ${context.raw}%`;
            },
          },
        },
      },
      scales: {
        y: {
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
            callback: function (value) {
              return value + "%";
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    },
  });

  showNotification(
    `Gráficos actualizados ${
      monthFilter !== "all"
        ? "para " + monthNames[parseInt(monthFilter) - 1]
        : ""
    }`
  );
}

// Función para calcular datos mensuales a partir de transacciones filtradas
function calculateFilteredMonthlyData(filteredTransactions) {
  const result = {
    ingresos: 0,
    retiradas: 0,
    total: 0,
  };

  // Procesar cada transacción filtrada
  filteredTransactions.forEach((transaction) => {
    if (transaction.tipo.toLowerCase() === "ingreso") {
      result.ingresos += transaction.cantidad;
    } else {
      result.retiradas += transaction.cantidad;
    }
  });

  result.total = result.ingresos + result.retiradas;
  return result;
}

// Función para exportar gráficos
function exportChart(chartId, fileName) {
  const chartCanvas = document.getElementById(chartId);
  const link = document.createElement("a");
  link.href = chartCanvas.toDataURL("image/png");
  link.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.png`;
  link.click();
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
  // Cargar datos desde localStorage
  loadFromLocalStorage();
  // Inicializar modo oscuro
  loadDarkModePreference();

  // Añadir event listener al interruptor
  document
    .getElementById("dark-mode-switch")
    .addEventListener("change", toggleDarkMode);

  // Si la pestaña de análisis está activa, inicializarla
  if (document.getElementById("analysis-tab").classList.contains("active")) {
    initAnalysisTab();
  }

  // Si no hay datos, cargar datos de ejemplo
  if (transactions.length === 0) {
    transactions = [...initialTransactions];
    saveToLocalStorage();
  }

  // Añadir event listener al filtro de mes
  document
    .getElementById("month-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;

      // Actualizar gráficos con el filtro aplicado
      updateCharts({
        month: filterValue
      });

      // También filtrar la tabla si estamos en la pestaña de datos
      if (document.getElementById("data-tab").classList.contains("active")) {
        const rows = document.querySelectorAll("#transactions-table tbody tr");
        const monthNames = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];

        rows.forEach((row) => {
          const month = row.cells[4].textContent.toLowerCase();
          const monthNum = monthNames.indexOf(month) + 1;
          row.style.display =
            filterValue === "all" || monthNum.toString() === filterValue ?
            "" :
            "none";
        });
      }
    });

  // Añadir event listener al filtro de tipo
  document
    .getElementById("type-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;

      // Actualizar gráficos con el filtro aplicado
      updateCharts({
        type: filterValue
      });

      // También filtrar la tabla si estamos en la pestaña de datos
      if (document.getElementById("data-tab").classList.contains("active")) {
        const rows = document.querySelectorAll("#transactions-table tbody tr");

        rows.forEach((row) => {
          const type = row.cells[1].textContent.toLowerCase();
          row.style.display =
            filterValue === "all" || type === filterValue ? "" : "none";
        });
      }

      // Inicializar ordenación
      setupSorting();

      // Añadir event listeners para los filtros
      document
        .getElementById("table-month-filter")
        .addEventListener("change", applyTableFilters);
      document
        .getElementById("table-type-filter")
        .addEventListener("change", applyTableFilters);
      document
        .getElementById("table-method-filter")
        .addEventListener("change", applyTableFilters);
      document
        .getElementById("table-search")
        .addEventListener("input", applyTableFilters);

      // Aplicar ordenación inicial
      sortTable("fecha", "desc");
    });

  // El botón de actualizar ahora aplicará los filtros actuales
  document.querySelector(".filter-item .btn-primary").onclick = function () {
    const monthFilter = document.getElementById("month-filter").value;
    const typeFilter = document.getElementById("type-filter").value;

    updateCharts({
      month: monthFilter,
      type: typeFilter,
    });
  };

  // Inicializar gráficos
  updateCharts();

  // Renderizar tabla de transacciones
  renderTransactionsTable();

  // Actualizar KPIs
  updateKPIs();

  // Añadir event listener al formulario
  document
    .getElementById("transaction-form")
    .addEventListener("submit", addTransaction);

  // Añadir event listener al filtro de búsqueda
  document.getElementById("search").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll("#transactions-table tbody tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? "" : "none";
    });
  });

  // Añadir event listener al filtro de tipo
  document
    .getElementById("type-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;
      const rows = document.querySelectorAll("#transactions-table tbody tr");

      rows.forEach((row) => {
        const type = row.cells[1].textContent.toLowerCase();
        row.style.display =
          filterValue === "all" || type === filterValue ? "" : "none";
      });
    });

  // Añadir event listener al filtro de mes
  document
    .getElementById("month-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;
      const rows = document.querySelectorAll("#transactions-table tbody tr");

      rows.forEach((row) => {
        const month = row.cells[4].textContent.toLowerCase();
        const monthNum = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ].indexOf(month) + 1;
        row.style.display =
          filterValue === "all" || monthNum.toString() === filterValue ?
          "" :
          "none";
      });
    });
});
// Variable para almacenar los datos del CSV
let csvData = null;

// Función para manejar la carga del archivo CSV
function handleCSVUpload(files) {
  if (files.length === 0) return;

  const file = files[0];
  const fileNameElement = document.getElementById("file-name");
  const processButton = document.getElementById("process-csv-btn");

  // Verificar que es un archivo CSV
  if (!file.name.toLowerCase().endsWith(".csv")) {
    showNotification("Por favor, seleccione un archivo CSV válido", false);
    fileNameElement.textContent = "Archivo no válido";
    processButton.disabled = true;
    return;
  }

  fileNameElement.textContent = file.name;

  // Leer el contenido del archivo
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      // Parsear el CSV
      csvData = parseCSV(e.target.result);
      processButton.disabled = false;
      showNotification(
        'CSV cargado correctamente. Haga clic en "Procesar CSV" para actualizar los datos.'
      );
    } catch (error) {
      console.error("Error parsing CSV:", error);
      showNotification("Error al procesar el archivo CSV", false);
      processButton.disabled = true;
    }
  };
  reader.onerror = function () {
    showNotification("Error al leer el archivo", false);
    processButton.disabled = true;
  };
  reader.readAsText(file);
}

// Función para parsear CSV manualmente (versión mejorada para el formato específico)
function parseCSV(csvText) {
  // Normalizar saltos de línea
  csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 1) {
    throw new Error('El CSV está vacío');
  }

  // Obtener headers - eliminar comillas circundantes si existen
  const firstLine = lines[0].replace(/^"|"$/g, '');
  const headers = firstLine.split(',').map(header => header.trim());
  console.log("Headers detectados:", headers);

  // Procesar las filas de datos
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;

    // Eliminar comillas circundantes de la línea completa
    const cleanLine = line.replace(/^"|"$/g, '');

    // Parsear la línea manualmente
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < cleanLine.length; j++) {
      const char = cleanLine[j];

      if (char === '"') {
        // Encontramos comillas dentro del campo
        if (insideQuotes && cleanLine[j + 1] === '"') {
          // Comillas escapadas (dos comillas seguidas)
          currentValue += '"';
          j++; // Saltar la siguiente comilla
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // Fin del campo
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }

    // Añadir el último valor
    values.push(currentValue.trim());

    // Crear objeto con los valores
    const row = {};
    headers.forEach((header, index) => {
      row[header] = index < values.length ? values[index] : '';
    });

    data.push(row);
  }

  return data;
}

// ==============================================
// FUNCIONES ESPECÍFICAS PARA ANÁLISIS DETALLADO
// ==============================================

// Función para calcular estadísticas detalladas
function calculateDetailedStats() {
  if (transactions.length === 0) return null;

  // Calcular promedios
  let totalIngresos = 0;
  let totalRetiradas = 0;
  let countIngresos = 0;
  let countRetiradas = 0;

  // Calcular método predominante
  const methodStats = {};

  // Calcular días de la semana con más actividad
  const weekdayStats = {
    'Lunes': 0,
    'Martes': 0,
    'Miércoles': 0,
    'Jueves': 0,
    'Viernes': 0,
    'Sábado': 0,
    'Domingo': 0
  };

  transactions.forEach(transaction => {
    // Calcular totales y contadores
    if (transaction.tipo.toLowerCase() === 'ingreso') {
      totalIngresos += Math.abs(transaction.cantidad);
      countIngresos++;
    } else {
      totalRetiradas += transaction.cantidad;
      countRetiradas++;
    }

    // Calcular métodos de pago
    if (!methodStats[transaction.metodo]) {
      methodStats[transaction.metodo] = 0;
    }
    methodStats[transaction.metodo]++;

    // Calcular días de la semana
    try {
      const fecha = new Date(transaction.fecha);
      const diaSemana = fecha.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      weekdayStats[dias[diaSemana]]++;
    } catch (e) {
      console.error('Error al procesar fecha:', transaction.fecha, e);
    }
  });

  // Calcular promedios
  const ingresoPromedio = countIngresos > 0 ? totalIngresos / countIngresos : 0;
  const retiradaPromedio = countRetiradas > 0 ? totalRetiradas / countRetiradas : 0;

  // Encontrar método predominante
  let metodoPredominante = 'Ninguno';
  let maxCount = 0;
  for (const method in methodStats) {
    if (methodStats[method] > maxCount) {
      maxCount = methodStats[method];
      metodoPredominante = method;
    }
  }
  const porcentajeMetodo = transactions.length > 0 ? ((maxCount / transactions.length) * 100).toFixed(0) : 0;

  // Encontrar día con más actividad
  let diaActivo = 'Ninguno';
  let maxDia = 0;
  for (const dia in weekdayStats) {
    if (weekdayStats[dia] > maxDia) {
      maxDia = weekdayStats[dia];
      diaActivo = dia;
    }
  }

  return {
    ingresoPromedio,
    retiradaPromedio,
    metodoPredominante,
    porcentajeMetodo,
    diaActivo,
    transaccionesDia: maxDia,
    totalTransacciones: transactions.length
  };
}

// Función para actualizar el gráfico de rentabilidad
function updateProfitabilityChart(monthFilter = "all") {
  // Destruir el gráfico existente si hay uno
  if (profitabilityChart) {
    profitabilityChart.destroy();
    profitabilityChart = null;
  }

  const ctx = document.getElementById('profitabilityChart');
  const noDataMsg = document.getElementById('noProfitabilityData');

  // Ocultar mensaje de no datos inicialmente
  noDataMsg.style.display = 'none';

  // Calcular datos mensuales (debe estar definida en tu código)
  const monthlyData = calculateMonthlyData();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calcular ROI para el mes filtrado o para todos los meses
  let profitabilityLabels, profitabilityData, profitabilityColors;

  if (monthFilter === "all") {
    // Filtrar meses con datos
    const mesesConDatos = Object.keys(monthlyData).filter(
      m => monthlyData[m].ingresos !== 0 || monthlyData[m].retiradas !== 0
    );

    // Verificar si hay datos
    if (mesesConDatos.length === 0) {
      noDataMsg.style.display = 'block';
      return;
    }

    profitabilityLabels = mesesConDatos.map(m => m.charAt(0).toUpperCase() + m.slice(1));
    profitabilityData = mesesConDatos.map(m => {
      const ingresos = Math.abs(monthlyData[m].ingresos);
      return ingresos === 0 ? 0 : ((monthlyData[m].total / ingresos) * 100);
    });
    profitabilityColors = mesesConDatos.map(m => {
      return monthlyData[m].total >= 0 ? 'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)';
    });
  } else {
    // Mes específico
    const monthIndex = parseInt(monthFilter) - 1;
    const monthName = monthNames[monthIndex];
    const monthKey = monthName.toLowerCase();
    const monthData = monthlyData[monthKey];

    // Verificar si hay datos para este mes
    if (!monthData || (monthData.ingresos === 0 && monthData.retiradas === 0)) {
      noDataMsg.style.display = 'block';
      return;
    }

    const ingresos = Math.abs(monthData.ingresos);

    profitabilityLabels = [monthName];
    profitabilityData = [ingresos === 0 ? 0 : ((monthData.total / ingresos) * 100)];
    profitabilityColors = [monthData.total >= 0 ?
      'rgba(46, 204, 113, 0.7)' : 'rgba(231, 76, 60, 0.7)'
    ];
  }

  // Crear el gráfico
  profitabilityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: profitabilityLabels,
      datasets: [{
        label: 'ROI (%)',
        data: profitabilityData,
        backgroundColor: profitabilityColors,
        borderColor: profitabilityColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `ROI: ${context.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'ROI (%)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function (value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Función para actualizar los KPIs de análisis detallado
function updateAnalysisKPIs() {
  const stats = calculateDetailedStats();

  if (!stats) {
    // No hay datos
    document.getElementById('ingreso-promedio').textContent = '0,00 €';
    document.getElementById('retirada-promedio').textContent = '0,00 €';
    document.getElementById('metodo-predominante').textContent = 'Ninguno';
    document.getElementById('porcentaje-metodo').textContent = '0% de transacciones';
    document.getElementById('dia-activo').textContent = 'Ninguno';
    document.getElementById('transacciones-dia').textContent = '0 transacciones';
    return;
  }

  // Actualizar los KPIs
  document.getElementById('ingreso-promedio').textContent = `${stats.ingresoPromedio.toFixed(2)} €`;
  document.getElementById('retirada-promedio').textContent = `${stats.retiradaPromedio.toFixed(2)} €`;
  document.getElementById('metodo-predominante').textContent = stats.metodoPredominante;
  document.getElementById('porcentaje-metodo').textContent = `${stats.porcentajeMetodo}% de transacciones`;
  document.getElementById('dia-activo').textContent = stats.diaActivo;
  document.getElementById('transacciones-dia').textContent = `${stats.transaccionesDia} transacciones`;
}

// Función para crear el gráfico de rentabilidad
function initProfitabilityChart() {
console.log("Inicializando gráfico de rentabilidad");
  const ctx = document.getElementById('profitabilityChart').getContext('2d');

  // Destruir el gráfico existente si ya existe
  if (profitabilityChart) {
    profitabilityChart.destroy();
    profitabilityChart = null;
  }

   // Calcular datos mensuales
   const monthlyData = calculateMonthlyData();
   const meses = [];
   const rentabilidad = [];
   const colores = [];
 
   for (const mes in monthlyData) {
     if (monthlyData[mes].ingresos !== 0 || monthlyData[mes].retiradas !== 0) {
       meses.push(mes.charAt(0).toUpperCase() + mes.slice(1));
       const ingresos = Math.abs(monthlyData[mes].ingresos);
       rentabilidad.push(ingresos === 0 ? 0 : ((monthlyData[mes].total / ingresos) * 100).toFixed(2));
       colores.push(monthlyData[mes].total >= 0 ? "rgba(46, 204, 113, 0.7)" : "rgba(231, 76, 60, 0.7)");
     }
   }
 
   // Crear el gráfico
   profitabilityChart = new Chart(ctx, {
     type: "bar",
     data: {
       labels: meses,
       datasets: [{
         label: "ROI (%)",
         data: rentabilidad,
         backgroundColor: colores,
         borderWidth: 1,
       }],
     },
     options: {
       responsive: true,
       plugins: {
         legend: { display: false },
         tooltip: {
           callbacks: {
             label: function (context) {
               return `ROI: ${context.raw}%`;
             },
           },
         },
       },
       scales: {
         y: {
           beginAtZero: true,
           title: { display: true, text: "ROI (%)" },
           grid: { color: "rgba(0, 0, 0, 0.05)" },
         },
         x: { grid: { display: false } },
       },
     },
   });
 }

// Función para inicializar toda la pestaña de análisis
function initAnalysisTab() {
  updateAnalysisKPIs();
  initProfitabilityChart();
  // Mostrar mensaje si no hay datos
  const noDataMsg = document.getElementById("noProfitabilityData");
  if (transactions.length === 0) {
    noDataMsg.style.display = "block";
  } else {
    noDataMsg.style.display = "none";
  }
}

// Función para procesar el CSV y actualizar los datos
function processCSV() {
  if (!csvData || csvData.length === 0) {
    showNotification("No hay datos CSV para procesar", false);
    return;
  }

  try {
    // Convertir los datos del CSV al formato de la aplicación
    const newTransactions = [];

    csvData.forEach((row, index) => {
      console.log(`Procesando fila ${index}:`, row);

      // Obtener valores de los campos (manejar diferentes nombres posibles)
      const fecha = row['Fecha'] || row['fecha'] || row['Date'] || '';
      const tipo = row['Tipo'] || row['tipo'] || row['Type'] || '';
      const metodo = row['Metodo'] || row['metodo'] || row['Method'] || row['Método'] || '';
      const cantidadStr = row['Cantidad'] || row['cantidad'] || row['Amount'] || row['Monto'] || '';
      const casa = row['Casa'] || row['casa'] || row['House'] || row['Platform'] || 'Bet365';
      const descripcion = row['Descripcion'] || row['descripcion'] || row['Description'] || row['Descripción'] || 'No contiene';

      // Validar campos obligatorios
      if (!fecha || !tipo || !cantidadStr) {
        console.warn(`Fila ${index+1} ignorada: Campos obligatorios faltantes`, row);
        return;
      }

      // Limpiar y convertir la cantidad
      const cantidadClean = cantidadStr.replace(/["']/g, '').replace(',', '.');
      const cantidad = parseFloat(cantidadClean);

      if (isNaN(cantidad)) {
        console.warn(`Fila ${index+1} ignorada: Cantidad inválida (${cantidadStr})`, row);
        return;
      }

      // Convertir formato de fecha si es necesario
      let fechaParaCalculo = fecha.replace(/["']/g, '');

      // Determinar el mes desde la fecha
      const dateObj = new Date(fechaParaCalculo);
      if (isNaN(dateObj.getTime())) {
        console.warn(`Fila ${index+1} ignorada: Fecha inválida (${fecha})`, row);
        return;
      }

      const monthNum = dateObj.getMonth();
      const monthNames = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
      const mes = monthNames[monthNum];

      // Ajustar el signo de la cantidad según el tipo
      const tipoLower = tipo.toLowerCase().replace(/["']/g, '');
      const formattedCantidad =
        tipoLower.includes("ingreso") || tipoLower.includes("depósito") ?
        -Math.abs(cantidad) :
        Math.abs(cantidad);

      // Crear la transacción con todos los campos
      newTransactions.push({
        fecha: fecha.replace(/["']/g, ''),
        tipo: tipo.replace(/["']/g, '').charAt(0).toUpperCase() + tipo.replace(/["']/g, '').slice(1).toLowerCase(),
        metodo: metodo.replace(/["']/g, '') || "Desconocido",
        cantidad: formattedCantidad,
        mes: mes,
        casa: casa.replace(/["']/g, ''),
        descripcion: descripcion.replace(/["']/g, '')
      });
    });

    // Reemplazar las transacciones existentes con las nuevas
    transactions = newTransactions;

    // Guardar en localStorage
    saveToLocalStorage();

    // Actualizar la interfaz
    renderTransactionsTable();
    updateCharts();
    updateKPIs();

    showNotification(`CSV procesado correctamente. ${newTransactions.length} transacciones importadas.`);

  } catch (error) {
    showNotification("Error al procesar CSV: " + error.message, false);
    console.error(error);
  }
}

// Función auxiliar para encontrar valores de campos sin importar el caso
function findFieldValue(row, possibleFieldNames) {
  for (const fieldName of possibleFieldNames) {
    for (const key in row) {
      if (key.toLowerCase() === fieldName.toLowerCase() && row[key]) {
        return row[key];
      }
    }
  }
  return null;
}

// Función para formatear fecha en formato YYYY-MM-DD HH:MM
function formatDateToStandard(dateInput) {
  // Si ya es una cadena en el formato correcto, devolverla tal cual
  if (
    typeof dateInput === "string" &&
    dateInput.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  ) {
    return dateInput;
  }

  // Si es un objeto Date, formatearlo
  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, "0");
    const day = String(dateInput.getDate()).padStart(2, "0");
    const hours = String(dateInput.getHours()).padStart(2, "0");
    const minutes = String(dateInput.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // Si es una cadena pero no está en el formato correcto, intentar convertirla
  if (typeof dateInput === "string") {
    try {
      const dateObj = new Date(dateInput);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
    } catch (e) {
      console.error("Error formateando fecha:", e);
    }
  }

  // Si no se puede formatear, devolver la entrada original
  return dateInput;
}

// Función para formatear fecha sin comas (formato: DD/MM/AAAA HH:MM)
function formatDateWithoutCommas(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Función para editar una transacción
function editTransaction(index) {
  // Obtener la transacción a editar
  const transaction = transactions[index];
  // Mostrar botón de cancelar
  document.getElementById("cancel-edit").style.display = "inline-block";

  // Convertir fecha del formato YYYY-MM-DD HH:MM a formato para input datetime-local
  // El input datetime-local necesita formato: YYYY-MM-DDTHH:MM
  const fechaForInput = transaction.fecha.replace(" ", "T");

  // Llenar el formulario con los datos existentes
  document.getElementById("date").value = fechaForInput;
  document.getElementById("type").value = transaction.tipo.toLowerCase();
  document.getElementById("amount").value = Math.abs(transaction.cantidad);
  document.getElementById("method").value = transaction.metodo;

  // Cambiar el texto del botón de guardar
  const submitButton = document.querySelector(
    '#transaction-form button[type="submit"]'
  );
  submitButton.innerHTML = '<i class="fas fa-edit"></i> Actualizar Transacción';
  submitButton.setAttribute("data-editing-index", index);

  // Desplazarse al formulario
  document
    .getElementById("transaction-form")
    .scrollIntoView({
      behavior: "smooth"
    });

  showNotification(
    'Modo edición activado. Complete los cambios y haga clic en "Actualizar Transacción"'
  );
}

// Función auxiliar para formatear la fecha para el input datetime-local
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Función para añadir o actualizar una transacción (calcula Mes desde Fecha)
function addTransaction(event) {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const method = document.getElementById("method").value;

  if (!date || !type || isNaN(amount) || !method) {
    showNotification(
      "Por favor, complete todos los campos correctamente",
      false
    );
    return;
  }
  // Formatear fecha correctamente (YYYY-MM-DD HH:MM)
  const dateObj = new Date(date);
  const formattedDate = formatDateToStandard(dateObj);

  // Determinar el mes desde la fecha
  const monthNum = dateObj.getMonth();
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = monthNames[monthNum];

  // Ajustar el signo de la cantidad según el tipo
  const formattedAmount =
    type === "ingreso" ? -Math.abs(amount) : Math.abs(amount);

  // Verificar si estamos editando una transacción existente
  const submitButton = document.querySelector(
    '#transaction-form button[type="submit"]'
  );
  const isEditing = submitButton.hasAttribute("data-editing-index");

  if (isEditing) {
    // Modo edición - actualizar transacción existente
    const index = parseInt(submitButton.getAttribute("data-editing-index"));

    transactions[index] = {
      fecha: formattedDate,
      tipo: type.charAt(0).toUpperCase() + type.slice(1),
      metodo: method,
      cantidad: formattedAmount,
      mes: month, // Calculado desde la fecha
      casa: transactions[index].casa || "Bet365", // Mantener el valor existente
      descripcion: transactions[index].descripcion || "Añadido desde web", // Mantener el valor existente
    };

    showNotification("Transacción actualizada correctamente");

    // Restaurar el botón a su estado original
    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Transacción';
    submitButton.removeAttribute("data-editing-index");
  } else {
    // Modo añadir - crear nueva transacción
    transactions.push({
      fecha: formattedDate,
      tipo: type.charAt(0).toUpperCase() + type.slice(1),
      metodo: method,
      cantidad: formattedAmount,
      mes: month, // Calculado desde la fecha
      casa: "Bet365", // Valor por defecto
      descripcion: "Descripcion ejemplo", // Valor por defecto
    });

    showNotification("Transacción añadida correctamente");
  }

  // Guardar en localStorage
  saveToLocalStorage();

  // Resetear formulario
  document.getElementById("transaction-form").reset();

  // Actualizar la interfaz
  renderTransactionsTable();
  updateCharts();
  updateKPIs();
}

// Función para cancelar la edición
function cancelEdit() {
  const submitButton = document.querySelector(
    '#transaction-form button[type="submit"]'
  );

  if (submitButton.hasAttribute("data-editing-index")) {
    // Restaurar el botón a su estado original
    // Ocultar botón de cancelar
    document.getElementById("cancel-edit").style.display = "none";

    submitButton.innerHTML = '<i class="fas fa-save"></i> Guardar Transacción';
    submitButton.removeAttribute("data-editing-index");

    // Resetear formulario
    document.getElementById("transaction-form").reset();

    showNotification("Edición cancelada");
  }
}

// Función para cambiar entre modo claro y oscuro
function toggleDarkMode() {
  const darkModeSwitch = document.getElementById("dark-mode-switch");
  const isDarkMode = darkModeSwitch.checked;

  // Guardar preferencia
  localStorage.setItem("darkMode", isDarkMode);

  // Aplicar tema
  if (isDarkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // Actualizar gráficos para reflejar el nuevo tema
  updateCharts();
}

// Función para cargar la preferencia de modo oscuro
function loadDarkModePreference() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const darkModeSwitch = document.getElementById("dark-mode-switch");

  darkModeSwitch.checked = darkMode;
  toggleDarkMode();
}