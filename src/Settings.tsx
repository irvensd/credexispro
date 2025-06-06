import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative">
        <div className="-mt-16 mb-4 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center shadow-lg border-4 border-white">
            <User className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Your Profile</h2>
          <p className="text-gray-500 text-sm">Manage your personal information</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-5">
          <div className="relative">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200">
              <User className="w-5 h-5 text-indigo-400 mr-2" />
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-800"
                autoComplete="name"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200">
              <Mail className="w-5 h-5 text-indigo-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-800"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="phone">Phone</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200">
              <Phone className="w-5 h-5 text-indigo-400 mr-2" />
              <input
                type="text"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-800"
                autoComplete="tel"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-1 font-medium" htmlFor="address">Address</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200">
              <MapPin className="w-5 h-5 text-indigo-400 mr-2" />
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-800"
                autoComplete="street-address"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition shadow-lg ${saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            disabled={saving}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {success && (
            <div className="text-green-600 text-center font-medium mt-2">Profile updated successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
} 