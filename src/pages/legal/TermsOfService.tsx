import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Shield, User, CreditCard, Lock } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      content: [
        'By accessing and using CredExis Pro, you agree to be bound by these Terms of Service.',
        'You must be at least 18 years old to use our services.',
        'You are responsible for maintaining the confidentiality of your account.',
        'You agree to provide accurate and complete information.',
        'We reserve the right to modify these terms at any time.'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: <User className="w-6 h-6 text-indigo-500" />,
      content: [
        'Maintain accurate account information',
        'Protect account credentials',
        'Comply with all applicable laws',
        'Use the service for legitimate purposes',
        'Report any security breaches'
      ]
    },
    {
      title: 'Payment Terms',
      icon: <CreditCard className="w-6 h-6 text-indigo-500" />,
      content: [
        'Subscription fees are billed in advance',
        'Automatic renewal unless cancelled',
        'Refund policy and conditions',
        'Payment method requirements',
        'Tax obligations and responsibilities'
      ]
    },
    {
      title: 'Intellectual Property',
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
      content: [
        'All content and materials are protected by copyright',
        'Limited license for personal use',
        'Prohibition of unauthorized copying',
        'Trademark and branding guidelines',
        'User content ownership and licensing'
      ]
    },
    {
      title: 'Limitations of Liability',
      icon: <AlertCircle className="w-6 h-6 text-indigo-500" />,
      content: [
        'Service provided "as is" without warranties',
        'Limitation of damages',
        'Force majeure conditions',
        'Third-party service limitations',
        'Indemnification requirements'
      ]
    },
    {
      title: 'Data Protection',
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      content: [
        'Compliance with data protection laws',
        'Data processing and storage',
        'User data rights and access',
        'Data breach notification',
        'International data transfers'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          Please read these Terms of Service carefully before using CredExis Pro. By accessing or using our 
          service, you agree to be bound by these terms. If you disagree with any part of the terms, you may 
          not access the service.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-indigo-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-600 mb-4">
            We may terminate or suspend your account and bar access to the service immediately, without prior 
            notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
            including but not limited to a breach of the Terms.
          </p>
          <p className="text-gray-600">
            If you wish to terminate your account, you may simply discontinue using the service. All provisions 
            of the Terms which by their nature should survive termination shall survive termination, including, 
            without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="mt-4">
            <p className="text-gray-700">
              Email: legal@credexispro.com<br />
              Address: 123 Business Street, Suite 100, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService; 