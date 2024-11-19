import { renderHook } from '@testing-library/react';
import { useRelationshipGender } from '../../hooks/useRelationshipGender';
import { describe, it, expect } from 'vitest';
import { BasicRelationship } from '../../types/FamilyTypes';

describe('useRelationshipGender Hook', () => {
  describe('determineGender', () => {
    it('should return male for male relationships', () => {
      const { result } = renderHook(() => useRelationshipGender());
      const maleRelationships: BasicRelationship[] = ['Father', 'Son', 'Brother'];
      
      maleRelationships.forEach(rel => {
        expect(result.current.determineGender(rel)).toBe('male');
      });
    });

    it('should return female for female relationships', () => {
      const { result } = renderHook(() => useRelationshipGender());
      const femaleRelationships: BasicRelationship[] = ['Mother', 'Daughter', 'Sister'];
      
      femaleRelationships.forEach(rel => {
        expect(result.current.determineGender(rel)).toBe('female');
      });
    });

    it('should return empty string for Spouse', () => {
      const { result } = renderHook(() => useRelationshipGender());
      expect(result.current.determineGender('Spouse')).toBe('');
    });
  });

  describe('showGenderField', () => {
    it('should return true only for Spouse', () => {
      const { result } = renderHook(() => useRelationshipGender());
      expect(result.current.showGenderField('Spouse')).toBe(true);
      expect(result.current.showGenderField('Father')).toBe(false);
      expect(result.current.showGenderField('Mother')).toBe(false);
    });
  });
}); 