import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      icon: <Shield className="w-6 h-6 text-green-500" />,
      description: 'Required for the website to function properly. These cookies enable core functionality such as security, network management, and accessibility.',
      examples: [
        'Authentication cookies',
        'Session management',
        'Security features',
        'Load balancing'
      ]
    },
    {
      type: 'Analytics Cookies',
      icon: <Settings className="w-6 h-6 text-blue-500" />,
      description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: [
        'Page view tracking',
        'User behavior analysis',
        'Performance monitoring',
        'Error tracking'
      ]
    },
    {
      type: 'Marketing Cookies',
      icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
      description: 'Used to track visitors across websites to display relevant advertisements.',
      examples: [
        'Ad targeting',
        'Social media integration',
        'Marketing campaign tracking',
        'Conversion tracking'
      ]
    },
    {
      type: 'Preference Cookies',
      icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
      description: 'Enable the website to remember information that changes the way the website behaves or looks.',
      examples: [
        'Language preferences',
        'Theme settings',
        'Customized content',
        'User preferences'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          This Cookie Policy explains how CredExis Pro uses cookies and similar technologies to recognize you 
          when you visit our website. It explains what these technologies are and why we use them, as well as 
          your rights to control our use of them.
        </p>

        <div className="space-y-8">
          {cookieTypes.map((cookieType, index) => (
            <motion.div
              key={cookieType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                {cookieType.icon}
                <h2 className="text-xl font-semibold text-gray-900">{cookieType.type}</h2>
              </div>
              <p className="text-gray-600 mb-4">{cookieType.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Examples:</h3>
                <ul className="space-y-2">
                  {cookieType.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-indigo-500">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
          <p className="text-gray-600 mb-4">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already 
            on your computer and you can set most browsers to prevent them from being placed.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Browser Settings</h3>
              <p className="text-gray-600">
                Most web browsers allow you to control cookies through their settings preferences. 
                However, limiting cookies may impact your experience using our website.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie Consent Tool</h3>
              <p className="text-gray-600">
                We provide a cookie consent tool that allows you to customize your cookie preferences. 
                You can access this tool at any time through the cookie settings link in the footer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiePolicy; 