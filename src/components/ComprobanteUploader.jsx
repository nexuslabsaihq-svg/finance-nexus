import React, { useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { uploadComprobante, deleteComprobante } from '../firebase/storage';
import { validateComprobanteFile } from '../utils/fileValidation';

/**
 * Selector/uploader reutilizable de comprobantes hacia Firebase Storage.
 * Guarda solo metadata + URL en el llamador (value), el archivo vive en Storage.
 *
 * @param {{
 *   modulo: 'gastos' | 'ingresos' | 'documentos',
 *   value: { url: string, path: string, name: string, size: number, type: string } | null,
 *   onChange: (attachment: object | null) => void,
 * }} props
 */
export default function ComprobanteUploader({ modulo, value, onChange }) {
  const { activeUid } = useAppData();
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');

    const { valid, error: validationError } = validateComprobanteFile(file);
    if (!valid) {
      setError(validationError);
      return;
    }

    if (!activeUid) {
      setError('Debes iniciar sesión para subir comprobantes.');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const attachment = await uploadComprobante(activeUid, file, modulo, setProgress);
      onChange(attachment);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.path) {
      await deleteComprobante(value.path);
    }
    onChange(null);
    setError('');
  };

  return (
    <div className="fgrp">
      <label className="flbl">Comprobante (imagen o PDF, máx. 10 MB)</label>

      {!value && !uploading && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="button" className="btn btn-gh btn-sm" onClick={() => inputRef.current.click()}>
            📎 Adjuntar comprobante
          </button>
          <input
            ref={inputRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleSelect}
          />
        </div>
      )}

      {uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pt" style={{ flex: 1 }}>
            <div className="pf" style={{ width: `${progress}%`, background: 'var(--blue)' }}></div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{progress}%</span>
        </div>
      )}

      {value && !uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <a href={value.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', wordBreak: 'break-all' }}>
            📄 {value.name}
          </a>
          <button type="button" className="btn btn-d btn-sm" onClick={handleRemove}>🗑️</button>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--pink)', fontSize: '12px', marginTop: '4px' }}>⚠️ {error}</div>
      )}
    </div>
  );
}
