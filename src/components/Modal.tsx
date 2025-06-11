import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useA11y } from '../hooks/useA11y';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  description,
  size = 'md',
}: ModalProps) {
  const { containerRef, ...a11yProps } = useA11y({
    trapFocus: true,
    autoFocus: true,
    restoreFocus: true,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          ref={containerRef}
          className={`relative w-full ${sizeClasses[size]} rounded-lg bg-white shadow-xl`}
          {...a11yProps}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-500"
                >
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
} 