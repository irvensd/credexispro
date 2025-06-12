import { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Shield, HelpCircle, LogOut, Check, X, UserCircle, Sun, Moon, Globe2, Languages, Accessibility, Download, Trash2, Mail, MessageSquare, Smartphone, ShieldCheck, KeyRound, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'preferences', label: 'Preferences', icon: <Globe className="w-5 h-5" /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
  { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
];

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Perfect for individuals and small businesses',
    features: [
      'Up to 50 clients',
      'Basic dispute management',
      'Email support',
      'Standard templates',
      'Basic analytics',
    ],
    limitations: [
      'No priority support',
      'No custom branding',
      'Limited API access',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    description: 'Ideal for growing businesses',
    features: [
      'Up to 200 clients',
      'Advanced dispute management',
      'Priority email support',
      'Custom templates',
      'Advanced analytics',
      'API access',
      'Custom branding',
    ],
    limitations: [
      'No dedicated account manager',
      'Limited automation',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations with advanced needs',
    features: [
      'Unlimited clients',
      'Enterprise dispute management',
      '24/7 priority support',
      'Custom templates & workflows',
      'Advanced analytics & reporting',
      'Full API access',
      'Custom branding & white-labeling',
      'Dedicated account manager',
      'Advanced automation',
      'Custom integrations',
    ],
    limitations: [],
    popular: false,
  },
];

function PlanSelectionModal({ isOpen, onClose, currentPlan }: { isOpen: boolean; onClose: () => void; currentPlan: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-500 mt-1">Select the plan that best fits your needs</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border ${
                  plan.popular
                    ? 'border-indigo-500 shadow-lg'
                    : 'border-gray-200'
                } p-6 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Limitations</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-600">
                              <X className="w-5 h-5 text-red-500" />
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className={`mt-6 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentPlan === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('pro'); // This would come from your backend
  const { user, setUser, mockUsers, logout } = useAuth();
  const navigate = useNavigate();
  const roles = ['admin', 'manager', 'user'];
  const [selectedUserId, setSelectedUserId] = useState(user.id);
  const selectedUser = mockUsers.find(u => u.id === selectedUserId) || user;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-[1400px] mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between min-h-[600px]">
        <div>
          {/* User Info */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user.name[0]}
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{user.plan} Plan</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-700 font-semibold shadow'
                    : 'text-gray-600 hover:bg-blue-50/50 hover:text-blue-600'
                }`}
              >
                <span className={`${activeSection === section.id ? 'text-blue-600' : 'text-gray-500'}`}>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 mt-8 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, security, and more</p>
        </div>
        {/* Section Content */}
        <div>
          {activeSection === 'profile' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
              <form className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                    {user.name[0]}
                  </div>
                  <button type="button" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Change Avatar</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" defaultValue={user.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" defaultValue={user.email} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                  <button type="button" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
              {/* Role switcher for admins - now inside Profile section */}
              {user.role === 'admin' && (
                <div className="mt-10 mb-4">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
                      <UserCircle className="w-6 h-6 text-indigo-400" />
                      Change User Role
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                          <select
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          >
                            {mockUsers.map(u => (
                              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <select
                            value={selectedUser.role}
                            onChange={e => {
                              if (selectedUser.id === user.id) setUser({ ...user, role: e.target.value });
                              selectedUser.role = e.target.value;
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
                          {selectedUser.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{selectedUser.name}</div>
                          <div className="text-sm text-gray-500">{selectedUser.email}</div>
                        </div>
                      </div>
                      <button
                        className="mt-4 w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base"
                        onClick={() => toast.success('User role updated!')}
                      >
                        Save Changes
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">Admins can change roles for any user in the organization.</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeSection === 'notifications' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Mail size={18} /> Email Notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><MessageSquare size={18} /> SMS Notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Smartphone size={18} /> Push Notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
              </div>
            </div>
          )}
          {activeSection === 'security' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Change Password</button>
                  <button type="button" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}
          {activeSection === 'billing' && (
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Plans</h2>
              <button onClick={() => setIsPlanModalOpen(true)} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Change Plan</button>
              {/* Plan cards and payment method management would go here */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
                <div className="font-medium text-gray-900 mb-2">Current Plan</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{user.plan}</span>
                  <span className="text-gray-500">$49/mo</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="font-medium text-gray-900 mb-2">Payment Method</div>
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-gray-400" />
                  <span className="text-gray-700">Visa ending in 1234</span>
                  <button className="ml-auto px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Update</button>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'preferences' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Sun size={18} /> Theme</span>
                  <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option>System</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Globe2 size={18} /> Language</span>
                  <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Accessibility size={18} /> Accessibility</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
              </div>
            </div>
          )}
          {activeSection === 'privacy' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Download size={18} /> Export Data</span>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">Export</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Trash2 size={18} /> Delete Account</span>
                  <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'help' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle size={18} />
                  <span>Need help? Contact our support team or browse the FAQ.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>support@credexispro.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Plan Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <PlanSelectionModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} currentPlan={currentPlan} />
        )}
      </AnimatePresence>
    </div>
  );
} 