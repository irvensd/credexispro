import React from 'react';
import { CheckCircle } from 'lucide-react';

const GDPRCompliance: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">GDPR Compliance</h1>
      
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
          <p className="text-gray-600">
            We are committed to protecting your personal data in accordance with GDPR requirements.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" />
              Right to access your personal data
            </li>
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" />
              Right to rectification
            </li>
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" />
              Right to erasure
            </li>
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" />
              Right to data portability
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GDPRCompliance; 