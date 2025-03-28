import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast types and their corresponding icons and colors
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600'
  },
  failed: { // Using "failed" instead of "error" as requested
    icon: AlertCircle,
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600'
  }
};

type ToastType = 'success' | 'failed' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
  dismiss: (id: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {}
});

// Export the context consumer hook
export const useToast = () => useContext(ToastContext);

// Toast Component
const ToastComponent: React.FC<{
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  onDismiss: () => void;
}> = ({
  id,
  type,
  message,
  duration,
  onDismiss,
}) => {
  const toastConfig = TOAST_TYPES[type];
  const Icon = toastConfig.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg text-white
        ${toastConfig.bgColor} border ${toastConfig.borderColor}
        w-full max-w-md
      `}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">{message}</div>
      <button 
        onClick={onDismiss}
        className="hover:opacity-75 p-1 flex-shrink-0 hover:bg-black/10 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toaster Provider Component
export const Toaster: React.FC<{ duration?: number }> = ({ 
  duration = 4000 
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Create a toast
  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    console.log(`Creating toast: ${type} - ${message}`); // Debug log
    setToasts(current => [...current, { id, type, message }]);
    return id;
  }, []);

  // Dismiss a toast
  const dismiss = useCallback((id: string) => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {/* Fixed Toast Container at Bottom Right */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div 
              key={toast.id} 
              className="pointer-events-auto"
              layout
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ToastComponent 
                id={toast.id} 
                type={toast.type} 
                message={toast.message} 
                duration={duration}
                onDismiss={() => dismiss(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default Toaster;