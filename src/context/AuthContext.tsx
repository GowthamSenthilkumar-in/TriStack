import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (details: { email: string; password?: string; name: string; role: Role; department?: string; registerNumber?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (details: { email: string; name: string; role: Role; department?: string; registerNumber?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  users: User[];
  refreshUsers: () => Promise<void>;
  addUser: (details: { name: string; email: string; password?: string; role: Role; department?: string; registerNumber?: string }) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Restore persistent session from localStorage
    const saved = localStorage.getItem('certifyx_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('certifyx_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      localStorage.setItem('certifyx_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const register = async (details: { email: string; password?: string; name: string; role: Role; department?: string; registerNumber?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      localStorage.setItem('certifyx_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const loginWithGoogle = async (details: { email: string; name: string; role: Role; department?: string; registerNumber?: string }) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Google authentication failed' };
      }

      setUser(data.user);
      localStorage.setItem('certifyx_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.warn('Failed to load users:', err);
    }
  };

  const addUser = async (details: { name: string; email: string; password?: string; role: Role; department?: string; registerNumber?: string }) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers((prev) => [...prev, data.user]);
      }
    } catch (err) {
      console.warn('Failed to create user:', err);
    }
  };

  const updateUserRole = (userId: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
      )
    );
  };

  const deleteUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.warn('Failed to delete user:', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('certifyx_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        users,
        refreshUsers,
        addUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
