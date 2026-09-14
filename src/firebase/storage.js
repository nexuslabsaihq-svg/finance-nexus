// ================================================================
// Utilidades de Firebase Storage — Comprobantes / Documentos
// Ruta segura por usuario: users/{uid}/comprobantes/{modulo}/{archivo}
// ================================================================
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';
import { validateComprobanteFile, sanitizeFileName } from '../utils/fileValidation';

/**
 * Sube un comprobante a Firebase Storage bajo la ruta del usuario autenticado.
 * @param {string} uid - UID del usuario autenticado (dueño de los datos).
 * @param {File} file - Archivo a subir.
 * @param {string} modulo - Subcarpeta lógica: 'gastos' | 'ingresos' | 'documentos'.
 * @param {(pct: number) => void} [onProgress] - Callback de progreso (0-100).
 * @returns {Promise<{ url: string, path: string, name: string, size: number, type: string, uploadedAt: string }>}
 */
export function uploadComprobante(uid, file, modulo, onProgress) {
  if (!uid) return Promise.reject(new Error('Debes iniciar sesión para subir comprobantes.'));
  if (!storage) return Promise.reject(new Error('Firebase Storage no está disponible.'));

  const { valid, error } = validateComprobanteFile(file);
  if (!valid) return Promise.reject(new Error(error));

  const safeName = sanitizeFileName(file.name);
  const path = `users/${uid}/comprobantes/${modulo}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      },
      (err) => {
        reject(new Error(mapStorageError(err)));
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({
            url,
            path,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          });
        } catch (err) {
          reject(new Error(mapStorageError(err)));
        }
      }
    );
  });
}

/**
 * Elimina un comprobante previamente subido. Falla de forma silenciosa (best-effort)
 * si el archivo ya no existe o no hay permisos, para no bloquear el flujo de la UI.
 * @param {string} path - Ruta del objeto en Storage.
 */
export async function deleteComprobante(path) {
  if (!path || !storage) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    // No-op: el archivo puede ya no existir o el usuario perdió permisos.
    console.warn('[Finance Nexus] No se pudo eliminar el comprobante:', err.message);
  }
}

function mapStorageError(err) {
  const code = err?.code || '';
  if (code.includes('unauthorized') || code.includes('permission')) {
    return 'No tienes permiso para subir este archivo.';
  }
  if (code.includes('canceled')) {
    return 'La subida fue cancelada.';
  }
  if (code.includes('quota')) {
    return 'Se alcanzó el límite de almacenamiento disponible.';
  }
  return err?.message || 'Ocurrió un error al subir el archivo.';
}
