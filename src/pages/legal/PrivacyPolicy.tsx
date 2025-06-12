import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Database, User } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <Database className="w-6 h-6 text-indigo-500" />,
      content: [
        'Personal information (name, email, contact details)',
        'Payment information (processed securely through our payment providers)',
        'Usage data and analytics',
        'Device and browser information',
        'IP addresses and location data'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="w-6 h-6 text-indigo-500" />,
      content: [
        'To provide and maintain our services',
        'To process your payments and manage your account',
        'To communicate with you about our services',
        'To improve our services and user experience',
        'To comply with legal obligations'
      ]
    },
    {
      title: 'Data Protection',
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      content: [
        'We implement appropriate security measures to protect your data',
        'Regular security audits and updates',
        'Encryption of sensitive information',
        'Access controls and authentication',
        'Regular backups and disaster recovery'
      ]
    },
    {
      title: 'Your Rights',
      icon: <User className="w-6 h-6 text-indigo-500" />,
      content: [
        'Right to access your personal data',
        'Right to correct inaccurate data',
        'Right to request data deletion',
        'Right to data portability',
        'Right to withdraw consent'
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      content: [
        'We use essential cookies for site functionality',
        'Analytics cookies to improve our services',
        'Marketing cookies (with your consent)',
        'You can manage cookie preferences',
        'Third-party cookies and tracking'
      ]
    },
    {
      title: 'Data Retention',
      icon: <Lock className="w-6 h-6 text-indigo-500" />,
      content: [
        'We retain data only as long as necessary',
        'Data is securely deleted when no longer needed',
        'Legal requirements for data retention',
        'Backup retention policies',
        'Data archiving procedures'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          At CredExis Pro, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our service.
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4">
            <p className="text-gray-700">
              Email: privacy@credexispro.com<br />
              Address: 123 Business Street, Suite 100, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy; 