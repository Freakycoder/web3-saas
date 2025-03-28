import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast types and their corresponding icons
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

// Toast context to manage global toast state
const ToastContext = React.createContext(null);

// Toast Provider Component
export const Toaster = ({ position = 'bottom-right', richColors = false, expand = false, duration = 4000 }) => {
  const [toasts, setToasts] = useState([]);

  const toast = React.useCallback((options) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(currentToasts => [
      ...currentToasts, 
      { 
        id, 
        ...options,
        type: options.type || 'default'
      }
    ]);
    return id;
  }, []);

  const dismiss = React.useCallback((toastId) => {
    setToasts(currentToasts => 
      currentToasts.filter(t => t.id !== toastId)
    );
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {/* Toast Container */}
      <div 
        className={`fixed z-[100] flex flex-col gap-2 p-4 
          ${position === 'top-right' ? 'top-0 right-0' : 
            position === 'top-left' ? 'top-0 left-0' : 
            position === 'bottom-left' ? 'bottom-0 left-0' : 
            'bottom-0 right-0'} 
          ${expand ? 'w-full max-w-md' : 'w-auto'}`}
      >
        {toasts.map((toast) => (
          <ToastComponent 
            key={toast.id} 
            {...toast} 
            richColors={richColors}
            duration={duration}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const ToastComponent = ({
  title, 
  description, 
  type = 'default', 
  richColors = false,
  duration = 4000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  const getColorClasses = () => {
    if (richColors) {
      switch(type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-black';
        case 'info': return 'bg-blue-500 text-white';
        default: return 'bg-gray-800 text-white';
      }
    }
    return 'bg-white border shadow-lg';
  };

  return (
    <div 
      className={`
        flex items-center gap-3 p-4 rounded-lg 
        ${getColorClasses()}
        animate-in slide-in-from-right
        relative
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-80">{description}</div>}
      </div>
      <button 
        onClick={onDismiss} 
        className="absolute top-2 right-2 hover:opacity-75"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Example Usage Component
export const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => toast({ title: 'Success', description: 'Operation completed', type: 'success' })}
        className="bg-green-500 text-white p-2 rounded"
      >
        Success Toast
      </button>
      <button 
        onClick={() => toast({ title: 'Error', description: 'Something went wrong', type: 'error' })}
        className="bg-red-500 text-white p-2 rounded"
      >
        Error Toast
      </button>
    </div>
  );
};

export default Toaster;