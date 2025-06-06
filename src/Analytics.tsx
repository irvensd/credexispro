import { useState, useEffect } from 'react';

const analyticsData = {
  leadConversion: 0,
  disputeSuccess: 0,
  totalLeads: 1,
  totalDisputes: 1,
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof analyticsData | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setData(analyticsData); // Set to null for empty state
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[120px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900">Analytics</div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📊</span>
          <span>No analytics data yet.</span>
        </div>
      ) : (
        <div>
          <div className="flex space-x-4 mb-2">
            <div className="flex-1 bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-xs text-blue-700 font-semibold mb-1 uppercase tracking-wide">Lead Conversion</div>
              <div className="text-2xl font-bold text-blue-700">{data.leadConversion}%</div>
              <div className="text-xs text-gray-500">{data.totalLeads} of {data.totalLeads} leads</div>
            </div>
            <div className="flex-1 bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xs text-green-700 font-semibold mb-1 uppercase tracking-wide">Dispute Success</div>
              <div className="text-2xl font-bold text-green-700">{data.disputeSuccess}%</div>
              <div className="text-xs text-gray-500">0 of {data.totalDisputes} disputes</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Lead to Client Conversion</div>
        </div>
      )}
    </div>
  );
} 