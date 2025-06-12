import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface GDPRRequest {
  type: 'export' | 'deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
}

const GDPRCompliance: React.FC = () => {
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDataExport = async () => {
    try {
      setIsExporting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRequest: GDPRRequest = {
        type: 'export',
        status: 'completed',
        date: new Date().toISOString(),
      };
      
      setRequests(prev => [newRequest, ...prev]);
      toast.success('Your data export is ready for download');
    } catch (error) {
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataDeletion = async () => {
    try {
      setIsDeleting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRequest: GDPRRequest = {
        type: 'deletion',
        status: 'completed',
        date: new Date().toISOString(),
      };
      
      setRequests(prev => [newRequest, ...prev]);
      setShowConfirmDelete(false);
      toast.success('Your account has been deleted');
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: GDPRRequest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
        <p className="text-gray-600">
          Manage your data and privacy rights under GDPR
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Export Your Data</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download a copy of all your personal data stored in our system. This includes your profile 
            information, activity history, and any other data associated with your account.
          </p>
          <button
            onClick={handleDataExport}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Delete Your Account</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone. 
            Please make sure to export your data before proceeding.
          </p>
          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDeleting}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </motion.div>
      </div>

      {requests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Requests</h2>
          <div className="space-y-4">
            {requests.map((request, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.type === 'export' ? 'Data Export' : 'Account Deletion'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone. 
              All your data will be permanently removed from our systems.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDataDeletion}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GDPRCompliance; 