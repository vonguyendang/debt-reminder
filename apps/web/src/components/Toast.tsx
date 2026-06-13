import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 20px',
            backgroundColor: t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--danger)' : 'var(--info)',
            color: '#000',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out',
            fontWeight: 500,
            fontSize: '0.875rem'
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
