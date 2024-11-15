import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminData } from '../types/admin';
import { Contact } from '../types/ContactTypes';
import { useUniverse } from './UniverseContext';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  isSetupComplete: boolean;
  universeId?: string;
  adminData?: AdminData & {
    contacts?: Contact[];
  };
}

interface AuthContextType {
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => void;
  completeSetup: (adminData: AdminData) => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createUniverse } = useUniverse();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const signin = async (email: string, password: string) => {
    const savedUser = localStorage.getItem(`user_${email}`);
    if (!savedUser) {
      throw new Error('Invalid credentials');
    }

    const userData = JSON.parse(savedUser);
    if (userData.password !== password) {
      throw new Error('Invalid credentials');
    }

    setUser({
      id: userData.id,
      email,
      isSetupComplete: userData.isSetupComplete,
      universeId: userData.universeId,
      adminData: userData.adminData
    });
  };

  const signup = async (email: string, password: string) => {
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const userId = uuidv4();
    const universe = await createUniverse(userId);

    const userData = {
      id: userId,
      email,
      password,
      isSetupComplete: false,
      universeId: universe.id,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    setUser({
      id: userId,
      email,
      isSetupComplete: false,
      universeId: universe.id
    });
  };

  const completeSetup = async (adminData: AdminData) => {
    if (!user) throw new Error('No user logged in');

    // Create admin contact
    const adminContact: Contact = {
      id: `contact-${adminData.id}`,
      name: `${adminData.firstName} ${adminData.lastName}`,
      categories: ['family'],
      relations: [{
        type: 'family',
        id: adminData.id,
        name: `${adminData.firstName} ${adminData.lastName}`
      }],
      role: 'Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add admin contact to contacts list
    const contacts = [adminContact];

    const updatedUser = {
      ...user,
      isSetupComplete: true,
      adminData: {
        ...adminData,
        contacts
      }
    };

    localStorage.setItem(`user_${user.email}`, JSON.stringify({
      ...updatedUser,
      password: JSON.parse(localStorage.getItem(`user_${user.email}`) || '{}').password
    }));

    setUser(updatedUser);
  };

  const updateUser = (updatedUser: User) => {
    if (!updatedUser) return;

    localStorage.setItem(`user_${updatedUser.email}`, JSON.stringify({
      ...updatedUser,
      password: JSON.parse(localStorage.getItem(`user_${updatedUser.email}`) || '{}').password
    }));

    setUser(updatedUser);
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signin, 
      signup, 
      signout, 
      completeSetup,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};