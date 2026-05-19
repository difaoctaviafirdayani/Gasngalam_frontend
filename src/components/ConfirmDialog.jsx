// src/components/ConfirmDialog.jsx
export default function ConfirmDialog({ open, icon = '⚠️', title, message, confirmLabel = 'Ya, Lanjutkan', confirmClass = 'btn-primary', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{icon}</div>
        <div className="modal-title">{title}</div>
        <div className="modal-sub">{message}</div>
        <div className="modal-btns">
          <button className={confirmClass} onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn-secondary" onClick={onCancel}>Batal</button>
        </div>
      </div>
    </div>
  );
}