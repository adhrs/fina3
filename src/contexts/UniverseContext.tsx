import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Universe {
  id: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface UniverseContextType {
  universe: Universe | null;
  createUniverse: (adminId: string) => Promise<Universe>;
  updateUniverse: (data: Partial<Universe>) => void;
}

const UniverseContext = createContext<UniverseContextType | null>(null);

export const useUniverse = () => {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error('useUniverse must be used within a UniverseProvider');
  }
  return context;
};

export const UniverseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [universe, setUniverse] = useState<Universe | null>(() => {
    const saved = localStorage.getItem('universe');
    return saved ? JSON.parse(saved) : null;
  });

  const createUniverse = async (adminId: string): Promise<Universe> => {
    const newUniverse: Universe = {
      id: uuidv4(),
      adminId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    setUniverse(newUniverse);
    localStorage.setItem('universe', JSON.stringify(newUniverse));
    return newUniverse;
  };

  const updateUniverse = (data: Partial<Universe>) => {
    if (!universe) return;

    const updatedUniverse = {
      ...universe,
      ...data,
      updatedAt: new Date().toISOString(),
      version: universe.version + 1
    };

    setUniverse(updatedUniverse);
    localStorage.setItem('universe', JSON.stringify(updatedUniverse));
  };

  return (
    <UniverseContext.Provider value={{ universe, createUniverse, updateUniverse }}>
      {children}
    </UniverseContext.Provider>
  );
};