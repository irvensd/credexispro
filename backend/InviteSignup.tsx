import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Mock pending invites (in a real app, fetch from backend)
const mockInvites: { token: string; email: string; role: string; org: string }[] = [
  // Example: { token: 'abc123', email: 'newuser@email.com', role: 'user', org: 'Acme Corp' }
];

export default function InviteSignup() {
  const { token } = useParams();
  const [form, setForm] = useState({ name: '', password: '' });
  const [success, setSuccess] = useState(false);

  // Find invite by token
  const invite = mockInvites.find(i => i.token === token);

  if (!invite) {
    return <div className="p-8 text-red-600 font-semibold">Invalid or expired invite link.</div>;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, create the user, mark invite as used, etc.
    setSuccess(true);
  }

  if (success) {
    return <div className="p-8 text-green-700 font-semibold">Account created! You can now log in.</div>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Accept Invitation</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6 border">
        <div>
          <label className="block text-sm font-medium mb-1">Organization</label>
          <input type="text" value={invite.org || 'Your Organization'} disabled className="w-full rounded border border-gray-200 px-3 py-2 text-sm bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input type="text" value={invite.role} disabled className="w-full rounded border border-gray-200 px-3 py-2 text-sm bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={invite.email} disabled className="w-full rounded border border-gray-200 px-3 py-2 text-sm bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" name="password" required value={form.password} onChange={handleChange} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create Account</button>
      </form>
    </div>
  );
} 