// Funciones relacionadas con el almacenamiento local
export function saveToLocalStorage(key, data) {
  if (!isLocalStorageAvailable()) return false;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Error al guardar datos:", e);
    return false;
  }
}

export function loadFromLocalStorage(key) {
  if (!isLocalStorageAvailable()) return null;

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error al obtener datos:", e);
    return null;
  }
}

export function isLocalStorageAvailable() {
  try {
    const test = "test";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}