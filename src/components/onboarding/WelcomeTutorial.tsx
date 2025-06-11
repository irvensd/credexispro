import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WelcomeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
}

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: 'Welcome to CredExis!',
      description: 'We\'re excited to have you on board. Let\'s take a quick tour of what CredExis can do for you.',
    },
    {
      title: 'Streamline Your Workflow',
      description: 'Manage clients, track tasks, and handle payments all in one place. Our intuitive interface makes it easy to stay organized.',
    },
    {
      title: 'Powerful Features',
      description: 'From client management to automated reporting, CredExis provides all the tools you need to grow your business.',
    },
    {
      title: 'Ready to Get Started?',
      description: 'You\'re all set! Start exploring CredExis and discover how it can help you manage your business more effectively.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 text-lg">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default WelcomeTutorial; 