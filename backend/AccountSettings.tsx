import React, { useState } from 'react';
import { Globe, Clock, Bell, Shield, Lock, Building2, CreditCard, Mail, Smartphone, KeyRound, UserCog, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountSettings() {
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'America/New_York',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [company, setCompany] = useState({
    name: 'Acme Corp',
    address: '456 Business Rd, City, Country',
  });
  const [plan, setPlan] = useState('Pro');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePrefChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };
  const handleNotifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center py-12 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-2">
          <UserCog className="w-7 h-7 text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        </div>
        {/* Account Preferences */}
        <section className="rounded-xl bg-indigo-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-indigo-700">Account Preferences</h2>
          </div>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSave}>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Language</label>
              <select
                name="language"
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-200"
                value={preferences.language}
                onChange={handlePrefChange}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Timezone</label>
              <select
                name="timezone"
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-200"
                value={preferences.timezone}
                onChange={handlePrefChange}
              >
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
              <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition shadow ${saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`} disabled={saving}>
                <CheckCircle2 className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
            {success && <div className="sm:col-span-2 text-green-600 text-center font-medium mt-2">Preferences updated!</div>}
          </form>
        </section>
        {/* Notification Settings */}
        <section className="rounded-xl bg-blue-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-blue-700">Notification Settings</h2>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <input type="checkbox" checked={notifications.email} name="email" onChange={handleNotifChange} className="accent-blue-500" />
              Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <input type="checkbox" checked={notifications.sms} name="sms" onChange={handleNotifChange} className="accent-blue-500" />
              SMS Notifications
            </label>
            <label className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <input type="checkbox" checked={notifications.push} name="push" onChange={handleNotifChange} className="accent-blue-500" />
              Push Notifications
            </label>
          </div>
        </section>
        {/* Security */}
        <section className="rounded-xl bg-yellow-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-yellow-700">Security</h2>
          </div>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Change Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-yellow-200">
                <Lock className="w-5 h-5 text-yellow-400 mr-2" />
                <input type="password" className="w-full bg-transparent outline-none text-gray-800" placeholder="New Password" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-yellow-200">
                <Lock className="w-5 h-5 text-yellow-400 mr-2" />
                <input type="password" className="w-full bg-transparent outline-none text-gray-800" placeholder="Confirm Password" />
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition shadow">
                <KeyRound className="w-5 h-5" />
                Update Password
              </button>
            </div>
          </form>
          <div className="mt-4">
            <label className="block text-gray-700 mb-1 font-medium">Two-Factor Authentication</label>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition shadow">
              <Shield className="w-5 h-5" />
              Enable 2FA
            </button>
          </div>
        </section>
        {/* Company Info */}
        <section className="rounded-xl bg-green-50/60 p-6 mb-2 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-green-700">Company/Organization Info</h2>
          </div>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSave}>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Company Name</label>
              <input type="text" name="name" className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-200" value={company.name} onChange={handleCompanyChange} />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Address</label>
              <input type="text" name="address" className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-200" value={company.address} onChange={handleCompanyChange} />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
              <button type="submit" className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition shadow ${saving ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`} disabled={saving}>
                <CheckCircle2 className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Company Info'}
              </button>
            </div>
            {success && <div className="sm:col-span-2 text-green-600 text-center font-medium mt-2">Company info updated!</div>}
          </form>
        </section>
        {/* Payment Plan */}
        <section className="rounded-xl bg-indigo-50/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-indigo-700">Payment Plan</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Current Plan:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{plan}</span>
          </div>
          <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition shadow">
            <CreditCard className="w-5 h-5" />
            Change Plan
          </button>
        </section>
      </motion.div>
    </div>
  );
} 