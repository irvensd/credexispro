import { useState } from 'react';
import { Download, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
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

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');

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
          value={overview.totalClients}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Disputes"
          value={overview.activeDisputes}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${overview.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Success Rate"
          value={`${overview.successRate}%`}
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
              <span className="font-medium">{clientMetrics.newClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Clients</span>
              <span className="font-medium">{clientMetrics.activeClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactive Clients</span>
              <span className="font-medium">{clientMetrics.inactiveClients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-medium">{clientMetrics.averageScore}</span>
            </div>
          </div>
        </div>

        {/* Dispute Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Disputes</span>
              <span className="font-medium">{disputeMetrics.totalDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved Disputes</span>
              <span className="font-medium">{disputeMetrics.resolvedDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Disputes</span>
              <span className="font-medium">{disputeMetrics.pendingDisputes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium">{disputeMetrics.successRate}%</span>
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
            <Line data={scoreImprovements} options={lineChartOptions} />
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
                      disputeTypes.creditCard,
                      disputeTypes.medical,
                      disputeTypes.student,
                      disputeTypes.other,
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