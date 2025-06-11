import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const variants = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function Toast({
  id,
  type,
  message,
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const Icon = icons[type];

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;

      if (newProgress <= 0) {
        onDismiss(id);
      } else {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative flex items-center p-4 mb-4 rounded-lg border ${variants[type]} shadow-lg`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
  }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
} 