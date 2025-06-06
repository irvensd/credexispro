import { useState } from 'react';
import React from 'react';

const growthData6 = [
  { month: 'Jan', value: 2 },
  { month: 'Feb', value: 3 },
  { month: 'Mar', value: 4 },
  { month: 'Apr', value: 6 },
  { month: 'May', value: 8 },
  { month: 'Jun', value: 10 },
];

const growthData12 = [
  { month: 'Jul', value: 1 },
  { month: 'Aug', value: 2 },
  { month: 'Sep', value: 2 },
  { month: 'Oct', value: 3 },
  { month: 'Nov', value: 4 },
  { month: 'Dec', value: 5 },
  ...growthData6,
];

export default function ClientGrowth() {
  const [range, setRange] = useState<'6m' | '1y'>('6m');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof growthData6 | typeof growthData12>([]);

  React.useEffect(() => {
    setTimeout(() => {
      setData(range === '6m' ? growthData6 : growthData12); // Set to [] for empty state
      setLoading(false);
    }, 1200);
  }, [range]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-h-[180px] flex flex-col justify-center">
      <div className="font-semibold text-lg mb-4 text-gray-900">Client Growth</div>
      <div className="flex items-center space-x-2 mb-4">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${range === '6m' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}
          onClick={() => setRange('6m')}
        >
          6 Months
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${range === '1y' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}
          onClick={() => setRange('1y')}
        >
          1 Year
        </button>
      </div>
      {loading ? (
        <div className="flex gap-2 w-full mb-2">
          {[...Array(range === '6m' ? 6 : 12)].map((_, i) => (
            <div key={i} className="w-6 h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📈</span>
          <span>No client growth data yet.</span>
        </div>
      ) : (
        <>
          <div className="h-36 flex items-end gap-2 w-full mb-2">
            {data.map((d) => (
              <div key={d.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-6 rounded-t-lg bg-indigo-400 transition-all"
                  style={{ height: `${d.value * 12}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Clients: {data[0].value}</span>
            <span>Clients: {data[data.length - 1].value}</span>
          </div>
        </>
      )}
    </div>
  );
} 