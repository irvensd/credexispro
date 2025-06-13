import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useTranslation = (namespace?: string) => {
  const { t } = useI18nTranslation(namespace);

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', options).format(dateObj);
    },
    []
  );

  const formatNumber = useCallback(
    (number: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat('en-US', options).format(number);
    },
    []
  );

  const formatCurrency = useCallback(
    (amount: number, currency = 'USD', options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        ...options,
      }).format(amount);
    },
    []
  );

  const formatPercentage = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        ...options,
      }).format(value / 100);
    },
    []
  );

  const formatRelativeTime = useCallback(
    (date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      if (diffInSeconds < 60) {
        return t('time.now');
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return t('time.minutes', { count: diffInMinutes });
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return t('time.hours', { count: diffInHours });
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return t('time.days', { count: diffInDays });
      }

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) {
        return t('time.weeks', { count: diffInWeeks });
      }

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return t('time.months', { count: diffInMonths });
      }

      const diffInYears = Math.floor(diffInDays / 365);
      return t('time.years', { count: diffInYears });
    },
    [t]
  );

  return {
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    formatPercentage,
    formatRelativeTime,
  };
};

export type TranslationHook = ReturnType<typeof useTranslation>; 