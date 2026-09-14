// ================================================================
// Validación de archivos de comprobantes — Finance Nexus
// Reglas aplicadas también del lado del servidor en storage.rules
// ================================================================

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

/**
 * Valida que un archivo cumpla con el tipo y tamaño permitido antes de subirlo.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateComprobanteFile(file) {
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP) o PDF.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `El archivo supera el tamaño máximo permitido (${(MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0)} MB).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'El archivo está vacío.' };
  }

  return { valid: true };
}

/**
 * Sanitiza un nombre de archivo para usarlo de forma segura en una ruta de Storage.
 * @param {string} name
 */
export function sanitizeFileName(name) {
  const trimmed = (name || 'archivo').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100);
}
