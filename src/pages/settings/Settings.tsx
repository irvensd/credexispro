import React, { useState } from 'react';
import { Bell, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [twoFactor, setTwoFactor] = useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Notifications Section */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="rounded-full bg-blue-100 p-2">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
              <button
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.push ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                <p className="text-sm text-gray-500">Receive emails about new features and offers</p>
              </div>
              <button
                onClick={() => handleNotificationChange('marketing')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.marketing ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.marketing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="rounded-full bg-purple-100 p-2">
              {/* Moon icon removed as per instructions */}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Customize how CredExis Pro looks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="rounded-full bg-red-100 p-2">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage your security preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  twoFactor ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    twoFactor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 