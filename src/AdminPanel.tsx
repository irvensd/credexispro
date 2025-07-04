import React, { useState } from 'react';
import { useInvites } from './contexts/InviteContext';
import { useAuth } from './contexts/AuthContext';

const roles = ['admin', 'manager', 'user'];
const plans = ['basic', 'pro', 'enterprise'];
const orgStatuses = ['active', 'suspended'];

// Initialize all related state as empty arrays or objects
const permissionKeys = [
  'viewUsers',
  'editUsers',
  'deleteUsers',
  'manageOrgs',
  'viewBilling',
  'manageInvites',
  'viewAudit',
  'manageRoles',
] as const;
type PermissionKey = typeof permissionKeys[number];

const permissionLabels: Record<PermissionKey, string> = {
  viewUsers: 'View Users',
  editUsers: 'Edit Users',
  deleteUsers: 'Delete Users',
  manageOrgs: 'Manage Organizations',
  viewBilling: 'View Billing',
  manageInvites: 'Manage Invites',
  viewAudit: 'View Audit Logs',
  manageRoles: 'Manage Roles',
};

function exportToCSV(filename: string, rows: any[], columns: string[], headers: string[]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      columns.map(col => {
        let val = row[col];
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val}"`;
          }
        }
        return val;
      }).join(',')
    )
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AdminPanel() {
  const { invites, addInvite, removeInvite } = useInvites();
  const { setUser } = useAuth();
  const [tab, setTab] = useState<'users' | 'orgs' | 'invites' | 'activity' | 'sessions' | 'audit' | 'roles' | 'orgSettings' | 'apiKeys'>('users');
  const [orgs, setOrgs] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchOrg, setSearchOrg] = useState('');
  const [searchInvite, setSearchInvite] = useState('');
  const [editUser, setEditUser] = useState<any>(null);
  const [editOrg, setEditOrg] = useState<any>(null);
  const [viewMembers, setViewMembers] = useState<any>(null);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const [orgPage, setOrgPage] = useState(1);
  const [orgPageSize, setOrgPageSize] = useState(10);
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('');
  const [orgStatusFilter, setOrgStatusFilter] = useState('');
  const [orgPlanFilter, setOrgPlanFilter] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityActionFilter, setActivityActionFilter] = useState('');
  const [activityActorFilter, setActivityActorFilter] = useState('');
  const [activityTargetFilter, setActivityTargetFilter] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionUserFilter, setSessionUserFilter] = useState('');
  const [sessionDeviceFilter, setSessionDeviceFilter] = useState('');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditEventTypeFilter, setAuditEventTypeFilter] = useState('');
  const [auditActorFilter, setAuditActorFilter] = useState('');
  const [auditResourceFilter, setAuditResourceFilter] = useState('');
  const [auditDateFrom, setAuditDateFrom] = useState('');
  const [auditDateTo, setAuditDateTo] = useState('');
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [selectedOrgSettingsId, setSelectedOrgSettingsId] = useState<string>('');
  const [orgSettingsDraft, setOrgSettingsDraft] = useState<any>(null);
  const [orgSettingsEditMode, setOrgSettingsEditMode] = useState(false);

  // Flatten all users for the user table
  const allUsers = orgs.flatMap(org => org.members.map((m: any) => ({ ...m, org: org.name, organizationId: org.id })));
  
  // Advanced filter logic for users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchesStatus = userStatusFilter ? user.status === userStatusFilter : true;
    const matchesRole = userRoleFilter ? user.role === userRoleFilter : true;
    const matchesPlan = userPlanFilter ? user.plan === userPlanFilter : true;
    return matchesSearch && matchesStatus && matchesRole && matchesPlan;
  });

  // Advanced filter logic for orgs
  const filteredOrgs = orgs.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchOrg.toLowerCase());
    const matchesStatus = orgStatusFilter ? org.status === orgStatusFilter : true;
    const matchesPlan = orgPlanFilter ? org.plan === orgPlanFilter : true;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Explicitly type all empty arrays as any[] to fix linter errors
  const filteredActivityLogs: any[] = [];
  const filteredAuditTrails: any[] = [];
  const uniqueActions: any[] = [];
  const uniqueActors: any[] = [];
  const uniqueTargets: any[] = [];
  const uniqueSessionUsers: any[] = [];
  const uniqueSessionDevices: any[] = [];
  const uniqueSessionStatuses: any[] = [];
  const uniqueAuditEventTypes: any[] = [];
  const uniqueAuditActors: any[] = [];
  const uniqueAuditResources: any[] = [];

  // Sort function
  const sortData = (data: any[], field: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      if (direction === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sorted data
  const getSortedData = (data: any[]) => {
    if (!sortField) return data;
    return sortData(data, sortField, sortDirection);
  };

  // Handle user edit save
  const handleUserSave = () => {
    setOrgs(prevOrgs => prevOrgs.map(org => ({
      ...org,
      members: org.members.map((member: any) => 
        member.id === editUser.id ? { ...member, ...editUser } : member
      )
    })));
    setEditUser(null);
    showSuccessMessage('User updated successfully');
  };

  // Handle organization edit save
  const handleOrgSave = () => {
    setOrgs(prevOrgs => prevOrgs.map(org => 
      org.id === editOrg.id ? { ...org, ...editOrg } : org
    ));
    setEditOrg(null);
    showSuccessMessage('Organization updated successfully');
  };

  // Handle user status toggle
  const handleUserStatusToggle = (userId: string) => {
    setOrgs(prevOrgs => prevOrgs.map(org => ({
      ...org,
      members: org.members.map((member: any) => 
        member.id === userId ? { ...member, status: member.status === 'active' ? 'suspended' : 'active' } : member
      )
    })));
    showSuccessMessage('User status updated successfully');
  };

  // Handle organization status toggle
  const handleOrgStatusToggle = (orgId: string) => {
    setOrgs(prevOrgs => prevOrgs.map(org => 
      org.id === orgId ? { ...org, status: org.status === 'active' ? 'suspended' : 'active' } : org
    ));
    showSuccessMessage('Organization status updated successfully');
  };

  // Handle user delete
  const handleUserDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setOrgs(prevOrgs => prevOrgs.map(org => ({
        ...org,
        members: org.members.filter((member: any) => member.id !== userId)
      })));
      showSuccessMessage('User deleted successfully');
    }
  };

  // Handle organization delete
  const handleOrgDelete = (orgId: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      setOrgs(prevOrgs => prevOrgs.filter((org: any) => org.id !== orgId));
      showSuccessMessage('Organization deleted successfully');
    }
  };

  // Show success message
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvite = {
      email: inviteEmail,
      role: inviteRole,
      token: Math.random().toString(36).substring(7),
      org: selectedOrg,
      sentAt: new Date().toISOString(),
      status: 'pending' as const,
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    addInvite(newInvite);
    setShowInviteUser(false);
    setInviteEmail('');
    setInviteRole('member');
    showSuccessMessage('Invite sent successfully');
  };

  // Handle invite resend
  const handleResendInvite = (invite: any) => {
    // In a real app, this would trigger an email
    showSuccessMessage(`Invite resent to ${invite.email}`);
  };

  // Handle invite revoke
  const handleRevokeInvite = (invite: any) => {
    if (window.confirm(`Are you sure you want to revoke the invite for ${invite.email}?`)) {
      removeInvite(invite.token);
      showSuccessMessage(`Invite revoked for ${invite.email}`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Filter invites
  const filteredInvites = invites.filter(invite =>
    invite.email.toLowerCase().includes(searchInvite.toLowerCase()) ||
    invite.role.toLowerCase().includes(searchInvite.toLowerCase()) ||
    invite.org.toLowerCase().includes(searchInvite.toLowerCase())
  );

  // Handle bulk selection
  const handleSelectAll = (type: 'users' | 'orgs') => {
    if (type === 'users') {
      setSelectedUsers(prev => 
        prev.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id)
      );
    } else {
      setSelectedOrgs(prev => 
        prev.length === filteredOrgs.length ? [] : filteredOrgs.map(o => o.id)
      );
    }
  };

  // Handle single item selection
  const handleSelectItem = (type: 'users' | 'orgs', id: string) => {
    if (type === 'users') {
      setSelectedUsers(prev => 
        prev.includes(id) ? prev.filter((i: any) => i !== id) : [...prev, id]
      );
    } else {
      setSelectedOrgs(prev => 
        prev.includes(id) ? prev.filter((i: any) => i !== id) : [...prev, id]
      );
    }
  };

  // Pagination helpers
  function paginate<T>(data: T[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }

  const pagedUsers = paginate(getSortedData(filteredUsers), userPage, userPageSize);
  const pagedOrgs = paginate(getSortedData(filteredOrgs), orgPage, orgPageSize);
  const userPageCount = Math.ceil(filteredUsers.length / userPageSize);
  const orgPageCount = Math.ceil(filteredOrgs.length / orgPageSize);

  // Export handlers
  const handleExportUsers = () => {
    const columns = ['name', 'email', 'role', 'plan', 'status', 'org'];
    const headers = ['Name', 'Email', 'Role', 'Plan', 'Status', 'Organization'];
    exportToCSV('users.csv', getSortedData(filteredUsers), columns, headers);
  };
  const handleExportOrgs = () => {
    const columns = ['name', 'plan', 'status'];
    const headers = ['Name', 'Plan', 'Status'];
    exportToCSV('organizations.csv', getSortedData(filteredOrgs), columns, headers);
  };

  // Revoke session handler
  const handleRevokeSession = () => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      // setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'revoked' } : s));
    }
  };

  // Export handler
  const handleExportAudit = () => {
    const columns = ['timestamp', 'actor', 'eventType', 'resource', 'resourceId', 'ip', 'details'];
    const headers = ['Timestamp', 'Actor', 'Event Type', 'Resource', 'Resource ID', 'IP Address', 'Details'];
    exportToCSV('audit_trails.csv', filteredAuditTrails, columns, headers);
  };

  // Toggle permission handler
  const handleTogglePermission = (role: string, perm: PermissionKey) => {
    setRolePermissions(prev =>
      prev.map(rp =>
        rp.role === role
          ? { ...rp, permissions: { ...rp.permissions, [perm]: !rp.permissions[perm] } }
          : rp
      )
    );
  };

  // Handler for selecting org in settings
  const handleSelectOrgSettings = (orgId: string) => {
    setSelectedOrgSettingsId(orgId);
    const org = orgs.find((o: any) => o.id === orgId);
    setOrgSettingsDraft(org ? { ...org } : null);
    setOrgSettingsEditMode(false);
  };

  // Handler for editing org settings
  const handleOrgSettingsChange = (field: string, value: string) => {
    setOrgSettingsDraft((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handler for saving org settings
  const handleSaveOrgSettings = () => {
    setOrgs(prev => prev.map(o => o.id === orgSettingsDraft.id ? { ...o, ...orgSettingsDraft } : o));
    setOrgSettingsEditMode(false);
  };

  // Handler for canceling edit
  const handleCancelOrgSettings = () => {
    const org = orgs.find((o: any) => o.id === selectedOrgSettingsId);
    setOrgSettingsDraft(org ? { ...org } : null);
    setOrgSettingsEditMode(false);
  };

  const filteredSessions: any[] = [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {successMessage}
        </div>
      )}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('users')}
        >Users</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'orgs' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('orgs')}
        >Organizations</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'invites' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('invites')}
        >Invites</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'activity' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('activity')}
        >Activity Logs</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'sessions' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('sessions')}
        >Sessions</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'audit' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('audit')}
        >Audit Trails</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'roles' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('roles')}
        >Role Permissions</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'orgSettings' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('orgSettings')}
        >Organization Settings</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'apiKeys' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setTab('apiKeys')}
        >API Keys</button>
      </div>
      {tab === 'users' && (
        <div>
          <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
              />
              <select
                value={userStatusFilter}
                onChange={e => setUserStatusFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <select
                value={userPlanFilter}
                onChange={e => setUserPlanFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              {(userStatusFilter || userRoleFilter || userPlanFilter) && (
                <button
                  className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setUserStatusFilter('');
                    setUserRoleFilter('');
                    setUserPlanFilter('');
                  }}
                >Clear Filters</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowInviteUser(true)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Invite User</button>
              <button
                className="px-3 py-1 bg-gray-100 border rounded text-sm hover:bg-gray-200"
                onClick={handleExportUsers}
              >Export CSV</button>
            </div>
          </div>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={() => handleSelectAll('users')}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('org')}>Org {sortField === 'org' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('role')}>Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('plan')}>Plan {sortField === 'plan' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user: any) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectItem('users', user.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.org}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 capitalize">{user.plan}</td>
                  <td className="p-2 capitalize">{user.status}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-600 hover:underline" onClick={() => setEditUser(user)}>Edit</button>
                    <button className="text-yellow-600 hover:underline" onClick={() => setUser({
                      id: user.id,
                      email: user.email,
                      name: user.name,
                      role: user.role,
                      organizationId: user.organizationId,
                      plan: user.plan
                    })}>Impersonate</button>
                    <button className="text-gray-600 hover:underline" onClick={() => handleUserStatusToggle(user.id)}>
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleUserDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls for users */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <label className="text-sm mr-2">Rows per page:</label>
              <select
                value={userPageSize}
                onChange={e => {
                  setUserPageSize(Number(e.target.value));
                  setUserPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[10, 25, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded text-sm"
                disabled={userPage === 1}
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
              >Prev</button>
              {Array.from({ length: userPageCount }, (_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 border rounded text-sm ${userPage === i + 1 ? 'bg-indigo-100 font-bold' : ''}`}
                  onClick={() => setUserPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button
                className="px-2 py-1 border rounded text-sm"
                disabled={userPage === userPageCount || userPageCount === 0}
                onClick={() => setUserPage(p => Math.min(userPageCount, p + 1))}
              >Next</button>
            </div>
          </div>
          {/* Edit User Modal */}
          {editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit User</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUserSave(); }}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" value={editUser.name} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={editUser.email} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select 
                      value={editUser.role} 
                      onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <select 
                      value={editUser.plan} 
                      onChange={e => setEditUser({ ...editUser, plan: e.target.value })}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    >
                      {plans.map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {tab === 'orgs' && (
        <div>
          <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchOrg}
                onChange={e => setSearchOrg(e.target.value)}
                className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
              />
              <select
                value={orgStatusFilter}
                onChange={e => setOrgStatusFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={orgPlanFilter}
                onChange={e => setOrgPlanFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              {(orgStatusFilter || orgPlanFilter) && (
                <button
                  className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setOrgStatusFilter('');
                    setOrgPlanFilter('');
                  }}
                >Clear Filters</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 bg-gray-100 border rounded text-sm hover:bg-gray-200"
                onClick={handleExportOrgs}
              >Export CSV</button>
            </div>
          </div>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrgs.length === filteredOrgs.length}
                    onChange={() => handleSelectAll('orgs')}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('plan')}>Plan {sortField === 'plan' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('members')}>Members {sortField === 'members' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrgs.map((org: any) => (
                <tr key={org.id} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedOrgs.includes(org.id)}
                      onChange={() => handleSelectItem('orgs', org.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-2">{org.name}</td>
                  <td className="p-2 capitalize">{org.plan}</td>
                  <td className="p-2 capitalize">{org.status}</td>
                  <td className="p-2">{org.members.length}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-600 hover:underline" onClick={() => setEditOrg(org)}>Edit</button>
                    <button className="text-indigo-600 hover:underline" onClick={() => setViewMembers(org.members)}>View Members</button>
                    <button className="text-gray-600 hover:underline" onClick={() => handleOrgStatusToggle(org.id)}>
                      {org.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleOrgDelete(org.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls for orgs */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <label className="text-sm mr-2">Rows per page:</label>
              <select
                value={orgPageSize}
                onChange={e => {
                  setOrgPageSize(Number(e.target.value));
                  setOrgPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[10, 25, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded text-sm"
                disabled={orgPage === 1}
                onClick={() => setOrgPage(p => Math.max(1, p - 1))}
              >Prev</button>
              {Array.from({ length: orgPageCount }, (_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 border rounded text-sm ${orgPage === i + 1 ? 'bg-indigo-100 font-bold' : ''}`}
                  onClick={() => setOrgPage(i + 1)}
                >{i + 1}</button>
              ))}
              <button
                className="px-2 py-1 border rounded text-sm"
                disabled={orgPage === orgPageCount || orgPageCount === 0}
                onClick={() => setOrgPage(p => Math.min(orgPageCount, p + 1))}
              >Next</button>
            </div>
          </div>
          {/* Edit Org Modal */}
          {editOrg && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Organization</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleOrgSave(); }}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" value={editOrg.name} className="w-full rounded border border-gray-200 px-3 py-2 text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <select 
                      value={editOrg.plan} 
                      onChange={e => setEditOrg({ ...editOrg, plan: e.target.value })}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    >
                      {plans.map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select 
                      value={editOrg.status} 
                      onChange={e => setEditOrg({ ...editOrg, status: e.target.value })}
                      className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                    >
                      {orgStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setEditOrg(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* View Members Modal */}
          {viewMembers && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Organization Members</h3>
                <ul className="space-y-2">
                  {viewMembers.map((member: any) => (
                    <li key={member.id} className="flex items-center gap-2 border-b pb-2">
                      <span className="font-semibold text-gray-900">{member.name}</span>
                      <span className="text-xs text-gray-500">{member.email}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 ml-auto">{member.role}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setViewMembers(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
              </div>
            </div>
          )}
        </div>
      )}
      {tab === 'invites' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search invites..."
              value={searchInvite}
              onChange={e => setSearchInvite(e.target.value)}
              className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
            />
            <button onClick={() => setShowInviteUser(true)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">New Invite</button>
          </div>

          {/* Pending Invites */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Pending Invites</h3>
            <table className="w-full text-sm bg-white rounded shadow border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Organization</th>
                  <th className="p-2 text-left">Sent At</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite: any) => (
                  <tr key={invite.token} className="border-t">
                    <td className="p-2">{invite.email}</td>
                    <td className="p-2 capitalize">{invite.role}</td>
                    <td className="p-2">{invite.org}</td>
                    <td className="p-2">{formatDate(invite.sentAt || new Date().toISOString())}</td>
                    <td className="p-2 flex gap-2">
                      <button 
                        onClick={() => handleResendInvite(invite)}
                        className="text-blue-600 hover:underline"
                      >
                        Resend
                      </button>
                      <button 
                        onClick={() => handleRevokeInvite(invite)}
                        className="text-red-600 hover:underline"
                      >
                        Revoke
                      </button>
                      <a 
                        href={`${window.location.origin}/invite/${invite.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Invite History</h3>
            <table className="w-full text-sm bg-white rounded shadow border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Organization</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Sent At</th>
                  <th className="p-2 text-left">Accepted/Expired At</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite: any) => (
                  <tr key={invite.id} className="border-t">
                    <td className="p-2">{invite.email}</td>
                    <td className="p-2 capitalize">{invite.role}</td>
                    <td className="p-2">{invite.org}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        invite.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        invite.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invite.status}
                      </span>
                    </td>
                    <td className="p-2">{formatDate(invite.sentAt)}</td>
                    <td className="p-2">
                      {invite.acceptedAt ? formatDate(invite.acceptedAt) :
                       invite.expiresAt ? formatDate(invite.expiresAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'activity' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search activity logs..."
              value={activitySearch}
              onChange={e => setActivitySearch(e.target.value)}
              className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
            />
            <select
              value={activityActionFilter}
              onChange={e => setActivityActionFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Actions</option>
              {uniqueActions.map((action: any) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <select
              value={activityActorFilter}
              onChange={e => setActivityActorFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Actors</option>
              {uniqueActors.map((actor: any) => (
                <option key={actor} value={actor}>{actor}</option>
              ))}
            </select>
            <select
              value={activityTargetFilter}
              onChange={e => setActivityTargetFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Targets</option>
              {uniqueTargets.map((target: any) => (
                <option key={target} value={target}>{target}</option>
              ))}
            </select>
            {(activityActionFilter || activityActorFilter || activityTargetFilter) && (
              <button
                className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setActivityActionFilter('');
                  setActivityActorFilter('');
                  setActivityTargetFilter('');
                }}
              >Clear Filters</button>
            )}
          </div>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Actor</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivityLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No activity found.</td></tr>
              ) : (
                filteredActivityLogs.map((log: any) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-2">{log.actor}</td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.target}</td>
                    <td className="p-2">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'sessions' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search sessions..."
              value={sessionSearch}
              onChange={e => setSessionSearch(e.target.value)}
              className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
            />
            <select
              value={sessionUserFilter}
              onChange={e => setSessionUserFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Users</option>
              {uniqueSessionUsers.map((user: any) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <select
              value={sessionDeviceFilter}
              onChange={e => setSessionDeviceFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Devices</option>
              {uniqueSessionDevices.map((device: any) => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
            <select
              value={sessionStatusFilter}
              onChange={e => setSessionStatusFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Statuses</option>
              {uniqueSessionStatuses.map((status: any) => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
            {(sessionUserFilter || sessionDeviceFilter || sessionStatusFilter) && (
              <button
                className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setSessionUserFilter('');
                  setSessionDeviceFilter('');
                  setSessionStatusFilter('');
                }}
              >Clear Filters</button>
            )}
          </div>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Device/Browser</th>
                <th className="p-2 text-left">IP Address</th>
                <th className="p-2 text-left">Login Time</th>
                <th className="p-2 text-left">Last Active</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-400">No sessions found.</td></tr>
              ) : (
                filteredSessions.map((sess: any) => (
                  <tr key={sess.id} className="border-t">
                    <td className="p-2">{sess.user}</td>
                    <td className="p-2">{sess.device}</td>
                    <td className="p-2">{sess.ip}</td>
                    <td className="p-2 whitespace-nowrap">{new Date(sess.loginTime).toLocaleString()}</td>
                    <td className="p-2 whitespace-nowrap">{new Date(sess.lastActive).toLocaleString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${sess.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{sess.status.charAt(0).toUpperCase() + sess.status.slice(1)}</span>
                    </td>
                    <td className="p-2">
                      {sess.status === 'active' && (
                        <button
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          onClick={() => handleRevokeSession()}
                        >Revoke</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'audit' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search audit trails..."
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              className="px-3 py-2 rounded border border-gray-200 text-sm w-64"
            />
            <select
              value={auditEventTypeFilter}
              onChange={e => setAuditEventTypeFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Event Types</option>
              {uniqueAuditEventTypes.map((type: any) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={auditActorFilter}
              onChange={e => setAuditActorFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Actors</option>
              {uniqueAuditActors.map((actor: any) => (
                <option key={actor} value={actor}>{actor}</option>
              ))}
            </select>
            <select
              value={auditResourceFilter}
              onChange={e => setAuditResourceFilter(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">All Resources</option>
              {uniqueAuditResources.map((resource: any) => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
            <input
              type="date"
              value={auditDateFrom}
              onChange={e => setAuditDateFrom(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
              placeholder="From"
            />
            <input
              type="date"
              value={auditDateTo}
              onChange={e => setAuditDateTo(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
              placeholder="To"
            />
            <button
              className="px-3 py-1 bg-gray-100 border rounded text-sm hover:bg-gray-200"
              onClick={handleExportAudit}
            >Export CSV</button>
            {(auditEventTypeFilter || auditActorFilter || auditResourceFilter || auditDateFrom || auditDateTo) && (
              <button
                className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setAuditEventTypeFilter('');
                  setAuditActorFilter('');
                  setAuditResourceFilter('');
                  setAuditDateFrom('');
                  setAuditDateTo('');
                }}
              >Clear Filters</button>
            )}
          </div>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Actor</th>
                <th className="p-2 text-left">Event Type</th>
                <th className="p-2 text-left">Resource</th>
                <th className="p-2 text-left">Resource ID</th>
                <th className="p-2 text-left">IP Address</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditTrails.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-400">No audit events found.</td></tr>
              ) : (
                filteredAuditTrails.map((log: any) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-2">{log.actor}</td>
                    <td className="p-2">{log.eventType}</td>
                    <td className="p-2">{log.resource}</td>
                    <td className="p-2">{log.resourceId}</td>
                    <td className="p-2">{log.ip}</td>
                    <td className="p-2">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'roles' && (
        <div>
          <h2 className="text-lg font-bold mb-4">Role Permissions</h2>
          <table className="w-full text-sm bg-white rounded shadow border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Role</th>
                {permissionKeys.map((perm: PermissionKey) => (
                  <th key={perm} className="p-2 text-center">{permissionLabels[perm]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((rp: any) => (
                <tr key={rp.role} className="border-t">
                  <td className="p-2 font-semibold">{rp.role}</td>
                  {permissionKeys.map((perm: PermissionKey) => (
                    <td key={perm} className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!rp.permissions[perm]}
                        onChange={() => handleTogglePermission(rp.role, perm)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        disabled={rp.role === 'Admin' && perm === 'viewUsers'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'orgSettings' && (
        <div className="flex gap-8">
          <div className="w-1/4">
            <h3 className="font-semibold mb-2">Organizations</h3>
            <ul>
              {orgs.map((org: any) => (
                <li key={org.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded mb-1 ${selectedOrgSettingsId === org.id ? 'bg-indigo-100 font-bold' : 'hover:bg-gray-100'}`}
                    onClick={() => handleSelectOrgSettings(org.id)}
                  >
                    {org.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            {orgSettingsDraft ? (
              <div className="bg-white rounded shadow p-6">
                <h3 className="text-lg font-bold mb-4">Settings for {orgSettingsDraft.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={orgSettingsDraft.name}
                      onChange={e => handleOrgSettingsChange('name', e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                      disabled={!orgSettingsEditMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <select
                      value={orgSettingsDraft.plan}
                      onChange={e => handleOrgSettingsChange('plan', e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                      disabled={!orgSettingsEditMode}
                    >
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={orgSettingsDraft.status}
                      onChange={e => handleOrgSettingsChange('status', e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                      disabled={!orgSettingsEditMode}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={orgSettingsDraft.contactEmail || ''}
                      onChange={e => handleOrgSettingsChange('contactEmail', e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                      disabled={!orgSettingsEditMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      value={orgSettingsDraft.address || ''}
                      onChange={e => handleOrgSettingsChange('address', e.target.value)}
                      className="px-3 py-2 border rounded w-full"
                      disabled={!orgSettingsEditMode}
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  {!orgSettingsEditMode ? (
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      onClick={() => setOrgSettingsEditMode(true)}
                    >Edit</button>
                  ) : (
                    <>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleSaveOrgSettings}
                      >Save</button>
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={handleCancelOrgSettings}
                      >Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 mt-8">Select an organization to view settings.</div>
            )}
          </div>
        </div>
      )}
      {/* Invite User Modal */}
      {showInviteUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Invite User</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={inviteEmail} 
                  onChange={e => setInviteEmail(e.target.value)} 
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organization</label>
                <select 
                  value={selectedOrg} 
                  onChange={e => setSelectedOrg(e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                >
                  {orgs.map((org: any) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={inviteRole} 
                  onChange={e => setInviteRole(e.target.value)} 
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
                >
                  {roles.map((role: any) => (
                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Send Invite</button>
                <button type="button" onClick={() => setShowInviteUser(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 