import { Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreditTools() {
  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-xl p-10 border border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-6 h-6 text-yellow-400" />
          <span className="text-lg font-bold text-indigo-700">Credit Tools</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">PRO</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Lock className="w-12 h-12 text-gray-300 mb-2" />
          <div className="text-xl font-semibold text-gray-800 text-center">Unlock Advanced Credit Tools</div>
          <div className="text-gray-500 text-center max-w-md">Access powerful credit analysis, dispute automation, and reporting tools to streamline your credit repair process.</div>
        </div>
        <button className="mt-6 px-6 py-2 rounded-full bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition text-base">Upgrade to PRO</button>
      </motion.div>
    </div>
  );
} 