import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { FormInput } from './components/FormInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { loginSchema, type LoginFormData } from './utils/validation';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
    }
  };

  const handleTestLogin = async () => {
    try {
      setIsTestLoading(true);
      await login('test@credexis.com', 'test123');
      toast.success('Test login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Test login failed');
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Credexis Pro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              id="email"
              type="email"
              label="Email address"
              autoComplete="email"
              placeholder="Enter your email"
              error={errors.email}
              {...register('email')}
            />

            <FormInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password}
              isPassword
              showPasswordToggle={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                'Sign in'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleTestLogin}
              disabled={isTestLoading || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isTestLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Test Login'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 