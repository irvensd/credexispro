import { useState } from 'react';
import { BarChart2, Download, Calendar, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { chartOptions, lineChartOptions, pieChartOptions } from './config/chart';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data for analytics
const mockData = {
  overview: {
    totalClients: 156,
    activeDisputes: 89,
    monthlyRevenue: 45600,
    successRate: 78,
  },
  clientMetrics: {
    newClients: 23,
    activeClients: 134,
    inactiveClients: 22,
    averageScore: 680,
  },
  disputeMetrics: {
    totalDisputes: 245,
    resolvedDisputes: 189,
    pendingDisputes: 56,
    successRate: 78,
  },
  revenueMetrics: {
    monthlyRevenue: 45600,
    yearlyRevenue: 547200,
    averageClientValue: 3500,
    revenueGrowth: 15,
  },
  disputeTypes: {
    creditCard: 45,
    medical: 30,
    student: 15,
    other: 10,
  },
  scoreImprovements: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Score',
        data: [620, 635, 645, 655, 670, 680],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  },
};

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting reports...');
  };

  const MetricCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">Last 365 days</option>
          </select>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Clients"
          value={mockData.overview.totalClients}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Disputes"
          value={mockData.overview.activeDisputes}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${mockData.overview.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Success Rate"
          value={`${mockData.overview.successRate}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Client Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">New Clients</span>
              <span className="font-medium">{mockData.clientMetrics.newClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Clients</span>
              <span className="font-medium">{mockData.clientMetrics.activeClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactive Clients</span>
              <span className="font-medium">{mockData.clientMetrics.inactiveClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-medium">{mockData.clientMetrics.averageScore}</span>
            </div>
          </div>
        </div>

        {/* Dispute Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Disputes</span>
              <span className="font-medium">{mockData.disputeMetrics.totalDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved Disputes</span>
              <span className="font-medium">{mockData.disputeMetrics.resolvedDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Disputes</span>
              <span className="font-medium">{mockData.disputeMetrics.pendingDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium">{mockData.disputeMetrics.successRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Improvements Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Improvements</h2>
          <div className="h-80">
            <Line data={mockData.scoreImprovements} options={lineChartOptions} />
          </div>
        </div>

        {/* Dispute Types Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Types</h2>
          <div className="h-80">
            <Pie
              data={{
                labels: ['Credit Card', 'Medical', 'Student', 'Other'],
                datasets: [
                  {
                    data: [
                      mockData.disputeTypes.creditCard,
                      mockData.disputeTypes.medical,
                      mockData.disputeTypes.student,
                      mockData.disputeTypes.other,
                    ],
                    backgroundColor: [
                      'rgb(54, 162, 235)',
                      'rgb(255, 99, 132)',
                      'rgb(255, 206, 86)',
                      'rgb(75, 192, 192)',
                    ],
                  },
                ],
              }}
              options={pieChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 