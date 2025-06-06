import React, { useState } from 'react';
import { Mail, Phone, HelpCircle, MessageCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the Security section in Settings and click on "Change Password" to reset your password.'
  },
  {
    question: 'How can I contact support?',
    answer: 'You can use the contact form below or email us at support@credexis.com.'
  },
  {
    question: 'Where can I manage my payment plan?',
    answer: 'Visit the Settings page and scroll to the Payment Plan section.'
  },
];

export default function HelpSupport() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-7 h-7 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
        </div>
        {/* FAQ Section */}
        <section className="rounded-xl bg-blue-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-blue-700">Frequently Asked Questions</h2>
          </div>
          <ul className="space-y-4">
            {faqs.map((faq, idx) => (
              <li key={idx} className="bg-white rounded-lg p-4 shadow flex flex-col">
                <div className="font-medium text-gray-800 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-indigo-400" />{faq.question}</div>
                <div className="text-gray-600 text-sm mt-1 pl-6">{faq.answer}</div>
              </li>
            ))}
          </ul>
        </section>
        {/* Contact Support Section */}
        <section className="rounded-xl bg-indigo-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-indigo-700">Contact Support</h2>
          </div>
          <div className="mb-2 text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" />Email: <a href="mailto:support@credexis.com" className="text-indigo-600 underline">support@credexis.com</a></div>
          <div className="mb-2 text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-400" />Phone: <a href="tel:+1234567890" className="text-indigo-600 underline">+1 (234) 567-890</a></div>
        </section>
        {/* Feedback Form Section */}
        <section className="rounded-xl bg-green-50/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-green-700">Send Us a Message</h2>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
              <div className="text-green-600 font-semibold text-lg">Thank you for your feedback! We will get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-200"
                  rows={4}
                  required
                />
              </div>
              <button type="submit" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition shadow">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </section>
      </motion.div>
    </div>
  );
} 