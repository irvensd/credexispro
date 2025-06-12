import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useRateLimit } from '../../hooks/useRateLimit';
import { useCaptcha } from '../../hooks/useCaptcha';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearErrors } = useFormValidation(forgotPasswordSchema);
  const {
    checkRateLimit,
    incrementAttempts,
    getRemainingAttempts,
    getLockTimeRemaining,
    isLocked,
  } = useRateLimit('forgotPassword');

  const { executeCaptcha } = useCaptcha(process.env.REACT_APP_RECAPTCHA_SITE_KEY || '');

  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [requiresCaptcha, setRequiresCaptcha] = useState(false);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        const remaining = getLockTimeRemaining();
        setLockTimeRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, getLockTimeRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    clearErrors();

    if (!checkRateLimit()) {
      setError(`Too many attempts. Please try again in ${Math.ceil(lockTimeRemaining / 60000)} minutes.`);
      return;
    }

    const formData = { email };
    if (!validate(formData)) {
      return;
    }

    setLoading(true);
    try {
      let captchaToken = '';
      if (requiresCaptcha) {
        captchaToken = await executeCaptcha('forgot_password');
      }

      const response = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        incrementAttempts();
        if (data.requiresCaptcha) {
          setRequiresCaptcha(true);
        }
        throw new Error(data.error || 'Failed to send reset email');
      }
      setSuccess(true);
      setRequiresCaptcha(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remainingAttempts = getRemainingAttempts();

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h2>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">
              If an account exists with this email, you will receive password reset instructions.
            </p>
          </div>
        )}

        {!isLocked && remainingAttempts < 5 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-600">
              {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining
            </p>
          </div>
        )}

        {requiresCaptcha && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">
              Please complete the verification to continue.
            </p>
          </div>
        )}

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
          disabled={loading || isLocked}
        />

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : isLocked ? (
              `Try again in ${Math.ceil(lockTimeRemaining / 60000)} minutes`
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 