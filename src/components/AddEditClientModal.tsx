import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Target, DollarSign, AlertCircle, Check } from 'lucide-react';
import type { Client } from '../types/Client';
import { activityService } from '../services/activityService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AddEditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'> & { id?: string }) => void;
  client?: Client | null;
}

const initialClient: Omit<Client, 'id'> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  status: 'Active',
  creditScore: 500,
  goalScore: 750,
  joinDate: new Date().toISOString().split('T')[0],
  disputes: 0,
  progress: 0,
  nextAction: '',
  totalPaid: 0,
  dateOfBirth: '',
  ssn: '',
  notes: '',
};

export default function AddEditClientModal({ isOpen, onClose, onSave, client }: AddEditClientModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Client, 'id'> & { id?: string }>(initialClient);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData(initialClient);
    }
    setErrors({});
    setCurrentStep(1);
  }, [client, isOpen]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Personal Information
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
    }

    if (step === 2) {
      // Credit Information
      if (formData.creditScore < 300 || formData.creditScore > 850) {
        newErrors.creditScore = 'Credit score must be between 300 and 850';
      }
      if (formData.goalScore < 300 || formData.goalScore > 850) {
        newErrors.goalScore = 'Goal score must be between 300 and 850';
      }
      if (formData.goalScore <= formData.creditScore) {
        newErrors.goalScore = 'Goal score must be higher than current credit score';
      }
    }

    if (step === 3) {
      // Service Information
      // (no servicePlan or monthlyFee validation)
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validateStep(currentStep)) {
        return;
      }
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const clientData = {
        ...formData,
        ...(client?.id ? { id: client.id } : {}),
        joinDate: client?.joinDate || formData.joinDate,
      };
      await onSave(clientData);
      if (client) {
        await activityService.logClientUpdated(`${clientData.firstName} ${clientData.lastName}`, user?.id || '');
      } else {
        await activityService.logClientAdded(`${clientData.firstName} ${clientData.lastName}`, user?.id || '');
      }
      setIsSubmitting(false);
      setFormData(initialClient);
      onClose();
    } catch (error) {
      console.error('Error submitting client:', error);
      toast.error('Failed to save client');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Client, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
    return value;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <p className="text-gray-500">Basic client details and contact information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="john.smith@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', formatPhoneNumber(e.target.value))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123 Main St, Miami, FL 33101"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Credit Information</h3>
              <p className="text-gray-500">Current credit status and goals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Credit Score *
                </label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={formData.creditScore}
                  onChange={(e) => handleChange('creditScore', parseInt(e.target.value) || 300)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.creditScore ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.creditScore && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.creditScore}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Credit Score *
                </label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={formData.goalScore}
                  onChange={(e) => handleChange('goalScore', parseInt(e.target.value) || 750)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.goalScore ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.goalScore && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.goalScore}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Credit Score Improvement</h4>
              <div className="text-2xl font-bold text-indigo-600">
                +{formData.goalScore - formData.creditScore} points
              </div>
              <p className="text-sm text-gray-500">
                Target improvement from {formData.creditScore} to {formData.goalScore}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Action Plan
              </label>
              <textarea
                value={formData.nextAction}
                onChange={(e) => handleChange('nextAction', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Initial credit report review and dispute strategy development..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Additional client notes and special considerations..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
              <p className="text-gray-500">Payment information</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Payment
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  value={formData.totalPaid}
                  onChange={(e) => handleChange('totalPaid', parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Create Client</h4>
                  <p className="text-sm text-green-700">
                    All information has been validated and is ready to save.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {client ? 'Edit Client' : 'Add New Client'}
              </h2>
              <p className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (client ? 'Update Client' : 'Create Client')}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 