import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function getMonthYear(dateVal: any) {
  let date: Date;
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    date = new Date(dateVal);
  } else if (dateVal.seconds) {
    // Firestore Timestamp
    date = new Date(dateVal.seconds * 1000);
  } else {
    return '';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getLastMonths(count: number) {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

export default function ClientGrowth() {
  const [range, setRange] = useState<'6m' | '1y'>('6m');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ month: string; value: number }[]>([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const snap = await getDocs(collection(db, 'clients'));
      const months = getLastMonths(range === '6m' ? 6 : 12);
      const counts: Record<string, number> = {};
      months.forEach(m => (counts[m] = 0));
      snap.forEach(doc => {
        const c = doc.data();
        const dateVal = c.createdAt || c.joinDate;
        const m = getMonthYear(dateVal);
        if (m && counts[m] !== undefined) counts[m]++;
      });
      setData(months.map(m => ({ month: m, value: counts[m] })));
      setLoading(false);
    })();
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