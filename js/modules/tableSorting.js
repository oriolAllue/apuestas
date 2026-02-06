// Funciones relacionadas con la ordenación de la tabla
export function sortTable(column, direction) {
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

    if (column === "cantidad") {
      aValue = parseFloat(aValue.replace("€", "").replace(",", "").trim());
      bValue = parseFloat(bValue.replace("€", "").replace(",", "").trim());
    }

    if (column === "fecha") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  rows.forEach((row) => tbody.appendChild(row));
  updateSortIndicators(column, direction);

  currentSort = {
    column,
    direction,
  };
}

export function getColumnIndex(columnName) {
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

export function updateSortIndicators(column, direction) {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.remove("asc", "desc");
  });

  const currentHeader = document.querySelector(`th[data-sort="${column}"]`);
  if (currentHeader) {
    currentHeader.classList.add(direction);
  }
}

export function setupSorting() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const column = th.getAttribute("data-sort");
      const direction =
        currentSort.column === column && currentSort.direction === "asc"
          ? "desc"
          : "asc";
      sortTable(column, direction);
    });
  });
}