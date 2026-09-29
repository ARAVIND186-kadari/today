import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <CheckCircle2 size={20} color="var(--gold-light)" />
          <div style={{ flexGrow: 1 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.message}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            style={{ color: 'var(--text-dim)', padding: '2px' }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
