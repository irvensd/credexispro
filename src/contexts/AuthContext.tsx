import React, { createContext, useContext, useState, ReactNode } from 'react';

// Remove mockUsers and mockOrganization, and allow user to be set from outside
export type User = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  organizationId?: string;
  plan?: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
} 