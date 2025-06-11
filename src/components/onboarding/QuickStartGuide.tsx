import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        'Complete your profile setup in Settings',
        'Configure your notification preferences',
        'Customize your dashboard layout',
        'Set up your payment processing'
      ]
    },
    {
      title: 'Client Management',
      items: [
        'Add your first client (⌘N)',
        'Upload client documents (⌘U)',
        'Create a new dispute case (⌘D)',
        'Record initial payment (⌘P)'
      ]
    },
    {
      title: 'Core Features',
      items: [
        'Use automated dispute workflows',
        'Generate and send dispute letters',
        'Track case progress and updates',
        'Manage client communications'
      ]
    },
    {
      title: 'Task Management',
      items: [
        'Create and assign tasks',
        'Set up recurring tasks',
        'Use task templates',
        'Monitor task completion'
      ]
    },
    {
      title: 'Reports & Analytics',
      items: [
        'View business performance metrics',
        'Track client success rates',
        'Monitor payment history',
        'Generate custom reports'
      ]
    },
    {
      title: 'Tips & Tricks',
      items: [
        'Use keyboard shortcuts for quick actions',
        'Enable desktop notifications',
        'Customize your dashboard widgets',
        'Set up automated workflows'
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              Quick Start Guide
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 text-sm font-medium">
                            {itemIndex + 1}
                          </span>
                        </span>
                        <span className="ml-3 text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Got it, thanks!
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default QuickStartGuide; 