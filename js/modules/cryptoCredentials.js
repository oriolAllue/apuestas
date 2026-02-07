// Módulo para manejar credenciales de forma segura

// Generar una clave de encriptación
async function generateKey() {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Exportar clave a formato JSON
async function exportKey(key) {
  const exported = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}

// Importar clave desde formato JSON
async function importKey(jsonKey) {
  const keyData = JSON.parse(jsonKey);
  return crypto.subtle.importKey(
    "jwk",
    keyData,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encriptar datos
async function encryptData(key, data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Vector de inicialización
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData
  );
  return { encryptedData: new Uint8Array(encrypted), iv };
}

// Desencriptar datos
async function decryptData(key, encryptedData, iv) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Manejar subida de fichero
export async function handleFileUpload(file, key, isEncrypted = false) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        if (isEncrypted) {
          const { encryptedData, iv } = JSON.parse(content);
          const decrypted = await decryptData(key, new Uint8Array(encryptedData), new Uint8Array(iv));
          resolve(decrypted);
        } else {
          const { encryptedData, iv } = await encryptData(key, content);
          resolve(JSON.stringify({ encryptedData: Array.from(encryptedData), iv: Array.from(iv) }));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Descargar contenido como fichero
export function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Función para cargar credenciales desde un fichero de texto
export async function loadCredentialsFromFile(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      try {
        const credentials = event.target.result.trim(); // Leer y limpiar el contenido
        resolve(credentials);
      } catch (error) {
        reject("Error al leer el fichero de credenciales: " + error);
      }
    };
    reader.onerror = () => reject("Error al cargar el fichero.");
    reader.readAsText(file);
  });
}

// Exportar funciones necesarias
export { generateKey, exportKey, importKey, encryptData, decryptData, handleFileUpload, downloadFile };