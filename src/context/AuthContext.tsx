'use client'; 

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Your client-side auth instance

// Define the shape of the context data
interface AuthContextType {
  currentUser: User | null;
  loading: boolean; // True while checking auth status
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Logout handler function (now inside the provider)
const apiLogout = () => fetch('/api/logout', { method: 'POST' });

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Unified Logout Logic
  const handleLogout = async () => {
    try {
      await signOut(auth); // 1. Client-side sign out
      await apiLogout();    // 2. Server-side cookie removal
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    // This listener is crucial for client-side state
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); 
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    handleLogout,
  };

  // Only render children when we know the auth status
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};