import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, webhook: string) => void;
  logout: () => void;
  getWebhook: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [webhook, setWebhook] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('vision_user');
    const savedWebhook = localStorage.getItem('vision_webhook');
    
    if (savedUser && savedWebhook) {
      setUser(JSON.parse(savedUser));
      setWebhook(savedWebhook);
    }
  }, []);

  const login = (userData: User, webhookUrl: string) => {
    setUser(userData);
    setWebhook(webhookUrl);
    localStorage.setItem('vision_user', JSON.stringify(userData));
    localStorage.setItem('vision_webhook', webhookUrl);
  };

  const logout = () => {
    setUser(null);
    setWebhook(null);
    localStorage.removeItem('vision_user');
    localStorage.removeItem('vision_webhook');
  };

  const getWebhook = () => webhook;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      getWebhook
    }}>
      {children}
    </AuthContext.Provider>
  );
};