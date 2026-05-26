function ToastStack({ toasts, onClose }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-body">
            <div className="toast-message">{toast.message}</div>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => onClose(toast.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
