import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, 
  TrendingUp, DollarSign, AlertTriangle, CheckCircle,
  FileText, User, MessageSquare, Bell
} from 'lucide-react';
import type { Client } from '../types/Client';

interface ClientDetailPageProps {
  client: Client;
  onBack: () => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: number) => void;
}

export default function ClientDetailPage({ client, onBack, onEdit, onDelete }: ClientDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-yellow-100 text-yellow-800';
      case 'Pro': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateCreditImprovement = () => {
    return client.goalScore - client.creditScore;
  };

  const getCreditScoreStatus = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 700) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 650) return { label: 'Fair', color: 'text-yellow-600' };
    if (score >= 600) return { label: 'Poor', color: 'text-orange-600' };
    return { label: 'Very Poor', color: 'text-red-600' };
  };

  const mockDisputeHistory = [
    { id: 1, date: '2024-01-15', item: 'Late Payment - Capital One', status: 'Resolved', improvement: 25 },
    { id: 2, date: '2024-01-10', item: 'Collection Account - Medical', status: 'In Progress', improvement: 0 },
    { id: 3, date: '2024-01-05', item: 'Credit Utilization Dispute', status: 'Resolved', improvement: 15 },
  ];

  const mockPaymentHistory = [
    { id: 1, date: '2024-01-01', amount: 49, status: 'Paid', method: 'Credit Card' },
    { id: 2, date: '2023-12-01', amount: 49, status: 'Paid', method: 'Bank Transfer' },
    { id: 3, date: '2023-11-01', amount: 49, status: 'Paid', method: 'Credit Card' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'disputes', label: 'Disputes', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Credit Score Overview */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{client.creditScore}</div>
                  <div className="text-sm text-gray-600">Current Score</div>
                  <div className={`text-sm font-medium ${getCreditScoreStatus(client.creditScore).color}`}>
                    {getCreditScoreStatus(client.creditScore).label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{client.goalScore}</div>
                  <div className="text-sm text-gray-600">Goal Score</div>
                  <div className={`text-sm font-medium ${getCreditScoreStatus(client.goalScore).color}`}>
                    {getCreditScoreStatus(client.goalScore).label}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">+{calculateCreditImprovement()}</div>
                  <div className="text-sm text-gray-600">Points to Gain</div>
                  <div className="text-sm font-medium text-indigo-600">
                    {Math.round((client.progress / 100) * calculateCreditImprovement())} gained
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{client.progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium text-gray-900">{client.firstName} {client.lastName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{client.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-900">{client.phone}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium text-gray-900">{client.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Join Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(client.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Service Plan</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(client.servicePlan || '')}`}>
                    {client.servicePlan}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Monthly Fee</div>
                  <div className="text-lg font-semibold text-gray-900">${client.monthlyFee}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Paid</div>
                  <div className="text-lg font-semibold text-green-600">${client.totalPaid.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Next Action */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Next Action Required</h3>
                  <p className="text-yellow-700">{client.nextAction || 'No pending actions'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'disputes':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute History</h3>
              <div className="space-y-4">
                {mockDisputeHistory.map((dispute) => (
                  <div key={dispute.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{dispute.item}</h4>
                      <p className="text-sm text-gray-500">{new Date(dispute.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {dispute.improvement > 0 && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">+{dispute.improvement}</span>
                        </div>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        dispute.status === 'Resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dispute.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-green-700">Resolved Disputes</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-yellow-700">In Progress</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">+40</div>
                <div className="text-sm text-blue-700">Points Gained</div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              <div className="space-y-4">
                {mockPaymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">${payment.amount}</div>
                        <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{payment.status}</div>
                      <div className="text-xs text-gray-500">{payment.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 mb-2">Total Revenue</h4>
                <div className="text-3xl font-bold text-green-600">${client.totalPaid.toLocaleString()}</div>
                <div className="text-sm text-green-700">From this client</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-2">Monthly Recurring</h4>
                <div className="text-3xl font-bold text-blue-600">${client.monthlyFee}</div>
                <div className="text-sm text-blue-700">Per month</div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {client.notes || 'No notes available for this client.'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Log</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Phone Call</span>
                    <span className="text-sm text-blue-600">Jan 15, 2024</span>
                  </div>
                  <p className="text-blue-800">Discussed current dispute progress and next steps.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Email Sent</span>
                    <span className="text-sm text-green-600">Jan 10, 2024</span>
                  </div>
                  <p className="text-green-800">Sent monthly progress report and credit improvement summary.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.firstName} {client.lastName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Client since {new Date(client.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(client)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Client</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {client.firstName} {client.lastName}? 
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(client.id);
                    setShowDeleteModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Client
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 