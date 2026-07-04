'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('munna_token');
    if (storedToken) {
      setToken(storedToken);
    } else if (pathname.startsWith('/admin')) {
      // If trying to access admin without token, redirect to login
      router.push('/login');
    }
  }, [pathname, router]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('munna_token', newToken);
    document.cookie = `munna_token=${newToken}; path=/; max-age=2592000; SameSite=Strict`; // 30 days
    router.push('/admin');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('munna_token');
    document.cookie = `munna_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
