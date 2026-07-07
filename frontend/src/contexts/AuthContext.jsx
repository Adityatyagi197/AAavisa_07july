import React, { createContext, useContext, useState, useEffect } from 'react';
import { AGENTS } from '../constants/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('crm-auth-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = !!currentUser;

  // Background sync: keep currentUser in sync with crm-agents-list updates
  useEffect(() => {
    if (!currentUser) return;
    try {
      const savedAgents = localStorage.getItem('crm-agents-list');
      if (savedAgents) {
        const agents = JSON.parse(savedAgents);
        const freshUser = agents.find(a => a.id === currentUser.id);
        if (freshUser) {
          // If customPermissions or other profile info changed, update auth session
          if (JSON.stringify(freshUser.customPermissions) !== JSON.stringify(currentUser.customPermissions) ||
              freshUser.name !== currentUser.name ||
              freshUser.email !== currentUser.email) {
            
            const updated = {
              ...currentUser,
              name: freshUser.name,
              email: freshUser.email,
              role: freshUser.role || currentUser.role,
              customPermissions: freshUser.customPermissions
            };
            localStorage.setItem('crm-auth-user', JSON.stringify(updated));
            setCurrentUser(updated);
          }
        }
      }
    } catch (e) {
      console.warn("Error syncing user session with agents list:", e);
    }
  }, [currentUser]);

  const login = (user, token) => {
    localStorage.setItem('crm-auth-user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('token', token);
    }
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('crm-auth-user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Refresh current user from a full updated agent object
  // Called when an admin updates an agent's permissions while they are logged in
  const refreshUser = (updatedAgent) => {
    if (!currentUser || currentUser.id !== updatedAgent.id) return;
    const updatedUser = {
      ...currentUser,
      name: updatedAgent.name,
      email: updatedAgent.email,
      role: updatedAgent.role || currentUser.role,
      avatar: updatedAgent.avatar || currentUser.avatar,
      customPermissions: updatedAgent.customPermissions,
    };
    localStorage.setItem('crm-auth-user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const changeRole = (role) => {
    let user = { 
      id: 'admin-1', 
      name: 'General Manager', 
      email: 'manager@aaabusinessconsultancy.com', 
      role: 'admin', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' 
    };
    
    if (role === 'super_admin') {
      user = { id: 'super-admin', name: 'Wael Madi (CEO)', email: 'wael.m@aaabusinessconsultancy.com', role: 'super_admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' };
    } else if (role === 'marketing') {
      user = { id: 'marketing-staff', name: 'Marketing Manager', email: 'marketing@aaabusinessconsultancy.com', role: 'marketing', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150' };
    } else if (role === 'consultant') {
      const saved = localStorage.getItem('crm-agents-list');
      const list = saved ? JSON.parse(saved) : AGENTS;
      const c = list.find(a => a.id === 'c1' || a.role === 'consultant') || { id: 'c1', name: 'Sofia Rodriguez', email: 'sofia@example.com', avatar: '' };
      user = { 
        id: c.id, 
        name: c.name, 
        email: c.email, 
        role: c.role || 'consultant', 
        avatar: c.avatar, 
        customPermissions: c.customPermissions 
      };
    } else if (role === 'finance') {
      user = { id: 'finance-staff', name: 'Elena Finance', email: 'finance@aaabusinessconsultancy.com', role: 'finance', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' };
    } else if (role === 'operations') {
      user = { id: 'operations-staff', name: 'Carlos Ops', email: 'ops@aaabusinessconsultancy.com', role: 'operations', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' };
    }

    localStorage.setItem('crm-auth-user', JSON.stringify(user));
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, changeRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
