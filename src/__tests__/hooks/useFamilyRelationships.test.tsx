import { renderHook } from '@testing-library/react';
import { useFamilyRelationships } from '../../hooks/useFamilyRelationships';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import { ReactNode } from 'react';
import { FamilyMember } from '../../types/FamilyTypes';

// Mock UniverseContext
vi.mock('../../contexts/UniverseContext', () => ({
  useUniverse: () => ({
    createUniverse: vi.fn()
  })
}));

describe('useFamilyRelationships Hook Tests', () => {
  const adminId = 'test-admin-id';
  
  // Minimale Testdaten mit nur dem Admin
  const testData = {
    id: adminId,
    firstName: "Test",
    lastName: "Admin",
    relationship: 'Admin',
    relatedTo: null,
    gender: "male",
    birthYear: "",
    exactBirthday: "1975-06-15",
    generationLevel: "0.0",
    universeId: 'test-universe'
  } as FamilyMember;

  // Setup localStorage mock
  beforeEach(() => {
    const mockUser = {
      id: adminId,
      email: 'test@test.com',
      isSetupComplete: true,
      adminData: testData
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Admin Relationship Tests', () => {
    it('Admin should have correct initial options when no family exists', () => {
      const { result } = renderHook(
        () => useFamilyRelationships([testData]),
        {
          wrapper: ({ children }: { children: ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
          )
        }
      );
      
      const options = result.current.getAvailableRelationships(adminId);
      
      expect(options).toContain('Spouse');
      expect(options).toContain('Father');
      expect(options).toContain('Mother');
      expect(options).toContain('Son');
      expect(options).toContain('Daughter');
    });
  });
});
