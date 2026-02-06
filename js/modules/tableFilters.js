// Funciones relacionadas con los filtros de la tabla
export function applyTableFilters() {
  const monthFilter = document.getElementById("table-month-filter").value;
  const typeFilter = document.getElementById("table-type-filter").value;
  const methodFilter = document.getElementById("table-method-filter").value;
  const searchFilter = document
    .getElementById("table-search")
    .value.toLowerCase();

  currentFilters = {
    month: monthFilter,
    type: typeFilter,
    method: methodFilter,
    search: searchFilter,
  };

  filterTable();
}

export function clearTableFilters() {
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

export function filterTable() {
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

    row.style.display =
      matchesMonth && matchesType && matchesMethod && matchesSearch
        ? ""
        : "none";
  });

  sortTable(currentSort.column, currentSort.direction);
}