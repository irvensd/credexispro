import React, { useState } from 'react';

const testimonials = [
  {
    name: 'Jane Smith',
    company: 'Smith Financial',
    quote: 'CredexisPro has transformed the way I manage my credit repair business. The automation and analytics are game changers!'
  },
  {
    name: 'Carlos Rivera',
    company: 'Rivera Credit Solutions',
    quote: 'I save hours every week and my clients love the transparency. Highly recommend for any business owner.'
  },
  {
    name: 'Ava Patel',
    company: 'Patel Credit Experts',
    quote: 'The dashboard and reporting features help me make smarter business decisions. My revenue is up 30%.'
  }
];

export default function Marketing() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or CRM
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">Grow Your Credit Repair Business with CredexisPro</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">All-in-one platform for business owners: automate workflows, track client progress, and boost your revenue with real-time analytics.</p>
        <a href="#contact" className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">Book a Demo</a>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Business Owners Choose CredexisPro</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-indigo-600 text-4xl mb-4">⚡</span>
            <h3 className="font-semibold text-lg mb-2">Automate Your Workflow</h3>
            <p className="text-gray-600 text-center">Save time with automated dispute management, reminders, and client onboarding.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-indigo-600 text-4xl mb-4">📈</span>
            <h3 className="font-semibold text-lg mb-2">Real-Time Analytics</h3>
            <p className="text-gray-600 text-center">Track client growth, revenue, and dispute success rates with powerful dashboards.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-indigo-600 text-4xl mb-4">🤝</span>
            <h3 className="font-semibold text-lg mb-2">Delight Your Clients</h3>
            <p className="text-gray-600 text-center">Offer a transparent, modern experience that keeps clients engaged and informed.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white border-t border-b">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-indigo-500 text-3xl mb-2">📊</span>
            <h4 className="font-semibold mb-1">Comprehensive Dashboard</h4>
            <p className="text-gray-600 text-center text-sm">See all your business metrics at a glance.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-indigo-500 text-3xl mb-2">🔄</span>
            <h4 className="font-semibold mb-1">Automated Disputes</h4>
            <p className="text-gray-600 text-center text-sm">Streamline dispute creation, tracking, and resolution.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-indigo-500 text-3xl mb-2">👥</span>
            <h4 className="font-semibold mb-1">Client Management</h4>
            <p className="text-gray-600 text-center text-sm">Easily manage clients, notes, and documents.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-indigo-500 text-3xl mb-2">💬</span>
            <h4 className="font-semibold mb-1">Integrated Messaging</h4>
            <p className="text-gray-600 text-center text-sm">Communicate with clients and team in one place.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Business Owners Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-indigo-600 text-3xl mb-2">"</span>
              <p className="text-gray-700 italic mb-4">{t.quote}</p>
              <div className="font-semibold text-indigo-700">{t.name}</div>
              <div className="text-gray-500 text-sm">{t.company}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 px-4 bg-white border-t">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book a Demo or Get in Touch</h2>
        <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow p-8">
          {submitted ? (
            <div className="text-center text-green-600 font-semibold text-lg">Thank you! We'll be in touch soon.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Tell us about your business or request a demo..."></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">Submit</button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">How can CredexisPro help my business grow?</h4>
            <p className="text-gray-600">By automating your workflow, providing actionable analytics, and improving client satisfaction, CredexisPro helps you scale efficiently and increase revenue.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Is my data secure?</h4>
            <p className="text-gray-600">Yes! We use industry-standard encryption and best practices to keep your business and client data safe.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Can I try CredexisPro before committing?</h4>
            <p className="text-gray-600">Absolutely! Book a demo or contact us to discuss your needs and see how CredexisPro can help your business.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 