import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => navigate('/clients/new')}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <span>{t('quickActions.newClient')}</span>
      </button>
      <button
        onClick={() => navigate('/tasks/new')}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <span>{t('quickActions.newTask')}</span>
      </button>
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <span>{t('quickActions.viewReports')}</span>
      </button>
    </div>
  );
};

export default QuickActions; 