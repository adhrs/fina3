import { describe, it, expect } from 'vitest';
import { familyValidation, FamilyMember } from '../../types/FamilyTypes';

describe('Family Validation', () => {
  const baseMember: FamilyMember = {
    id: 'test-id',
    firstName: 'Test',
    lastName: 'User',
    relationship: 'Admin',
    gender: 'male',
    birthYear: '1980',
    exactBirthday: '1980-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };

  describe('isDuplicate', () => {
    it('should detect duplicate relationships', () => {
      const existingMember: FamilyMember = {
        ...baseMember,
        id: 'spouse-id',
        relationship: 'Spouse',
        relatedTo: baseMember.id
      };

      const newMember: FamilyMember = {
        ...baseMember,
        id: 'another-spouse-id',
        relationship: 'Spouse',
        relatedTo: baseMember.id
      };

      expect(familyValidation.isDuplicate(newMember, [existingMember])).toBe(true);
    });

    it('should allow different relationships', () => {
      const existingMember: FamilyMember = {
        ...baseMember,
        id: 'spouse-id',
        relationship: 'Spouse',
        relatedTo: baseMember.id
      };

      const newMember: FamilyMember = {
        ...baseMember,
        id: 'father-id',
        relationship: 'Father',
        relatedTo: baseMember.id
      };

      expect(familyValidation.isDuplicate(newMember, [existingMember])).toBe(false);
    });

    it('should allow same relationship type for different base members', () => {
      const existingMember: FamilyMember = {
        ...baseMember,
        id: 'father-1-id',
        relationship: 'Father',
        relatedTo: 'person-1-id'
      };

      const newMember: FamilyMember = {
        ...baseMember,
        id: 'father-2-id',
        relationship: 'Father',
        relatedTo: 'person-2-id'
      };

      expect(familyValidation.isDuplicate(newMember, [existingMember])).toBe(false);
    });
  });
}); 