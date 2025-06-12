import React, { createContext, useContext, useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface OnboardingContextType {
  startTour: () => void;
  isFirstVisit: boolean;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const tourSteps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to CredExis! Let\'s take a quick tour of our main features.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.dashboard-widget',
    content: 'This is your dashboard where you can see all your important metrics at a glance.',
    placement: 'bottom',
  },
  {
    target: '.clients-section',
    content: 'Manage your clients and their information here.',
    placement: 'right',
  },
  {
    target: '.tasks-section',
    content: 'Keep track of your tasks and deadlines in this section.',
    placement: 'left',
  },
  {
    target: '.reports-section',
    content: 'Generate and view detailed reports about your business.',
    placement: 'top',
  },
];

const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [run, setRun] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage('isFirstVisit', true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('hasCompletedOnboarding', false);

  useEffect(() => {
    if (isFirstVisit && !hasCompletedOnboarding) {
      setRun(true);
    }
  }, [isFirstVisit, hasCompletedOnboarding]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setIsFirstVisit(false);
      setHasCompletedOnboarding(true);
    }
  };

  const startTour = () => {
    setRun(true);
  };

  const completeOnboarding = () => {
    setIsFirstVisit(false);
    setHasCompletedOnboarding(true);
  };

  return (
    <OnboardingContext.Provider value={{ startTour, isFirstVisit, completeOnboarding }}>
      {children}
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#4F46E5',
            zIndex: 1000,
          },
        }}
      />
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingProvider; 