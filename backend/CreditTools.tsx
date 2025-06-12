import { Lock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreditTools() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="credit-tools-page"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 80, damping: 20 }}
        className="space-y-8 p-4 sm:p-8 bg-gray-50 min-h-screen"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Credit Tools</h1>
            <p className="text-base sm:text-lg text-gray-500 mt-1">Access calculators, simulators, and resources to help clients improve credit</p>
          </div>
        </motion.div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          <div className="p-6 space-y-8">
            {/* Example Tool: Credit Score Simulator */}
            <div className="bg-indigo-50 rounded-xl p-6 shadow-sm border border-indigo-100">
              <h2 className="text-lg font-bold text-indigo-900 mb-2">Credit Score Simulator</h2>
              <p className="text-gray-700 mb-4">Estimate how actions like paying down debt or removing negative items could impact a credit score.</p>
              {/* ...simulator UI here... */}
              <button className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition">Try Simulator</button>
            </div>
            {/* Example Tool: Debt-to-Income Calculator */}
            <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
              <h2 className="text-lg font-bold text-green-900 mb-2">Debt-to-Income Calculator</h2>
              <p className="text-gray-700 mb-4">Quickly calculate a client's debt-to-income ratio to assess creditworthiness.</p>
              {/* ...calculator UI here... */}
              <button className="px-4 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition">Use Calculator</button>
            </div>
            {/* Example Tool: Resource Library */}
            <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-100">
              <h2 className="text-lg font-bold text-yellow-900 mb-2">Resource Library</h2>
              <p className="text-gray-700 mb-4">Access educational guides, sample letters, and credit improvement resources.</p>
              {/* ...resource links here... */}
              <button className="px-4 py-2 rounded bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 focus:outline-none transition">Browse Resources</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 