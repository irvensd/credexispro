import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock data for testing
const mockOrganization = {
  id: 'org1',
  name: 'Acme Corp',
  plan: 'pro',
};

const mockUsers = [
  { id: '1', email: 'admin@acme.com', name: 'Alice', role: 'admin', organizationId: 'org1', plan: 'pro' },
  { id: '2', email: 'manager@acme.com', name: 'Bob', role: 'manager', organizationId: 'org1', plan: 'pro' },
  { id: '3', email: 'user@acme.com', name: 'Carol', role: 'user', organizationId: 'org1', plan: 'pro' },
];

type User = typeof mockUsers[0] | null;
type Organization = typeof mockOrganization;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  organization: Organization;
  mockUsers: Exclude<User, null>[];
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo, pick the first user as logged in
  const [user, setUser] = useState<User>(mockUsers[0]);
  const [organization] = useState<Organization>(mockOrganization);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, organization, mockUsers, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
} 