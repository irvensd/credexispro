import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { accessibilityManager } from '../../utils/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Register keyboard shortcuts
      accessibilityManager.registerKeyboardShortcut(
        'escape',
        () => onClose(),
        'Close modal'
      );

      // Create focus trap
      const cleanup = accessibilityManager.createFocusTrap(modalRef.current!);

      // Announce modal opening
      accessibilityManager.announce(`${title} modal opened. ${description || ''}`);

      return () => {
        cleanup();
      };
    }
  }, [isOpen, title, description, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      ref={modalRef}
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        {...accessibilityManager.generateAriaAttributes({
          role: 'dialog',
          'aria-labelledby': 'modal-title',
          'aria-describedby': description ? 'modal-description' : undefined,
        })}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {description && (
          <p
            id="modal-description"
            className="mb-4 text-sm text-gray-500"
          >
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}; 