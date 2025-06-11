import { Megaphone, Plus, Mail, MessageSquare, BarChart, FileText, X, Users, Target, ArrowUpRight, Calendar, Filter, ChevronDown, ChevronUp, Search, Eye, Edit, Trash2, Share2, Copy, Settings, MoreVertical, TrendingUp, Users2, MailOpen, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

const mockCampaigns = [
  { 
    id: 1, 
    name: 'Welcome Email', 
    type: 'Email', 
    status: 'Sent', 
    date: '2024-01-15', 
    openRate: '45%', 
    clickRate: '12%',
    audience: 'New Clients',
    sent: 250,
    opens: 113,
    clicks: 30,
    conversions: 8,
    revenue: '$2,400'
  },
  { 
    id: 2, 
    name: 'Follow-up SMS', 
    type: 'SMS', 
    status: 'Scheduled', 
    date: '2024-01-20', 
    openRate: 'N/A', 
    clickRate: 'N/A',
    audience: 'Active Clients',
    sent: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: '$0'
  },
  { 
    id: 3, 
    name: 'Credit Score Update', 
    type: 'Email', 
    status: 'Draft', 
    date: '2024-01-25', 
    openRate: 'N/A', 
    clickRate: 'N/A',
    audience: 'All Clients',
    sent: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: '$0'
  }
];

interface Template {
  id: number;
  name: string;
  type: string;
  description: string;
  successRate: number;
  avgOpenRate: number;
  avgClickRate: number;
  category: string;
}

const templates = [
  { 
    id: 1, 
    name: 'Credit Repair Introduction', 
    type: 'Email', 
    description: 'A professional introduction email for new clients.',
    successRate: 85,
    avgOpenRate: 45,
    avgClickRate: 12,
    category: 'Onboarding'
  },
  { 
    id: 2, 
    name: 'Follow-up Reminder', 
    type: 'SMS', 
    description: 'A friendly reminder SMS for follow-up appointments.',
    successRate: 92,
    avgOpenRate: 78,
    avgClickRate: 35,
    category: 'Appointments'
  },
  { 
    id: 3, 
    name: 'Credit Score Milestone', 
    type: 'Email', 
    description: 'Celebrate credit score improvements with clients.',
    successRate: 88,
    avgOpenRate: 52,
    avgClickRate: 18,
    category: 'Engagement'
  }
];

const audiences = [
  { id: 1, name: 'New Clients', count: 250, growth: 12 },
  { id: 2, name: 'Active Clients', count: 450, growth: 8 },
  { id: 3, name: 'At-Risk Clients', count: 75, growth: -5 },
  { id: 4, name: 'High-Value Clients', count: 125, growth: 15 }
];

export default function Marketing() {
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: 'all'
  });
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('campaigns');

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilters = 
      (!filters.type || campaign.type === filters.type) &&
      (!filters.status || campaign.status === filters.status) &&
      (filters.dateRange === 'all' || 
        (filters.dateRange === 'week' && new Date(campaign.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filters.dateRange === 'month' && new Date(campaign.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
    
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
            <p className="text-gray-600 mt-1">Manage campaigns, templates, and audience segments</p>
          </div>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Audience</p>
                <h3 className="text-2xl font-bold mt-1">900</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                8%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Open Rate</p>
                <h3 className="text-2xl font-bold mt-1">45%</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <MailOpen className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                5%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Click Rate</p>
                <h3 className="text-2xl font-bold mt-1">12%</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MousePointerClick className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                3%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-1">3.2%</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Target className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUpRight size={16} />
                0.8%
              </span>
              <span className="text-sm text-gray-600">vs last month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'campaigns' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Megaphone size={20} />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'templates' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FileText size={20} />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('audiences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'audiences' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Users2 size={20} />
            Audiences
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filters
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Sent">Sent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {campaign.type === 'Email' ? <Mail size={16} /> : <MessageSquare size={16} />}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">ID: {campaign.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {campaign.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'Sent' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.audience}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.openRate}</div>
                          <div className="text-xs text-gray-500">Open Rate</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.clickRate}</div>
                          <div className="text-xs text-gray-500">Click Rate</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Duplicate"
                        >
                          <Copy size={20} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                setIsNewCampaignModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {template.type === 'Email' ? (
                    <Mail className="text-blue-600" size={20} />
                  ) : (
                    <MessageSquare className="text-blue-600" size={20} />
                  )}
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{template.category}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={16} />
                  {template.successRate}% Success
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <MailOpen size={16} />
                  {template.avgOpenRate}% Open
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <MousePointerClick size={16} />
                  {template.avgClickRate}% Click
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audiences Tab */}
      {activeTab === 'audiences' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{audience.name}</h3>
                <span className={`text-sm ${
                  audience.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {audience.growth >= 0 ? '+' : ''}{audience.growth}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{audience.count}</div>
              <div className="flex items-center gap-2">
                <Users2 size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Total Contacts</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Campaign Modal */}
      <AnimatePresence>
        {isNewCampaignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedTemplate ? 'Create Campaign from Template' : 'New Campaign'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedTemplate 
                        ? `Using template: ${selectedTemplate.name}`
                        : 'Create a new marketing campaign'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsNewCampaignModalOpen(false);
                      setSelectedTemplate(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter campaign name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                      <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                      <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="new">New Clients</option>
                        <option value="active">Active Clients</option>
                        <option value="at-risk">At-Risk Clients</option>
                        <option value="high-value">High-Value Clients</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                      <input
                        type="datetime-local"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter subject line"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={6}
                      placeholder="Enter your message"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCampaignModalOpen(false);
                        setSelectedTemplate(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Campaign
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 