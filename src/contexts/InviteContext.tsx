import { createContext, useContext, useState, ReactNode } from 'react';

export interface Invite {
  email: string;
  role: string;
  token: string;
  org: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  acceptedAt: string | null;
  expiresAt: string;
}

type InviteContextType = {
  invites: Invite[];
  addInvite: (invite: Invite) => void;
  removeInvite: (token: string) => void;
  getInviteByToken: (token: string) => Invite | undefined;
};

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invites, setInvites] = useState<Invite[]>([]);

  const addInvite = (invite: Invite) => {
    setInvites(prev => [...prev, { ...invite, sentAt: new Date().toISOString(), status: 'pending' }]);
  };

  const removeInvite = (token: string) => {
    setInvites(prev => prev.filter(invite => invite.token !== token));
  };

  const getInviteByToken = (token: string) => {
    return invites.find(invite => invite.token === token);
  };

  return (
    <InviteContext.Provider value={{ invites, addInvite, removeInvite, getInviteByToken }}>
      {children}
    </InviteContext.Provider>
  );
}

export function useInvites() {
  const context = useContext(InviteContext);
  if (!context) throw new Error('useInvites must be used within InviteProvider');
  return context;
} 