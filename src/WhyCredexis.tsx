import { motion } from 'framer-motion';
import { ShieldCheck, BarChart2, Users, Zap, FileText, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: 'Automate Disputes',
    desc: 'Save time and reduce errors with automated dispute workflows.'
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-600" />,
    title: 'Client Management',
    desc: 'Easily manage all your clients, notes, and documents in one place.'
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
    title: 'Analytics & Growth',
    desc: 'Track your business performance and client progress with real-time analytics.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    title: 'Secure & Compliant',
    desc: 'Your data is protected with industry-leading security and compliance.'
  },
  {
    icon: <FileText className="w-8 h-8 text-indigo-600" />,
    title: 'Document Automation',
    desc: 'Generate, store, and send documents with a click.'
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
    title: 'Business Growth',
    desc: 'Tools to help you scale your credit repair business.'
  },
];

export default function WhyCredexis() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Credexis?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Credexis empowers credit specialists and professionals with modern tools to automate, manage, and grow their business—all in one beautiful platform.</p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <div className="text-center mt-12">
          <button className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-lg">Get Started with Credexis</button>
        </div>
      </motion.div>
    </div>
  );
} 