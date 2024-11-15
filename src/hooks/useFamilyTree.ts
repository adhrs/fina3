import { useState, useEffect, useCallback } from 'react';
import { FamilyMember, Relationship } from '../types/FamilyTypes';
import { MemoryService } from '../services/memoryService';

const memoryService = MemoryService.getInstance();

export const useFamilyTree = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [loadedMembers, loadedRelationships] = await Promise.all([
          memoryService.getFamilyMembers(),
          memoryService.getRelationships()
        ]);
        
        setMembers(loadedMembers);
        setRelationships(loadedRelationships);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Data loading failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addMember = useCallback(async (member: FamilyMember) => {
    try {
      setLoading(true);
      await memoryService.addFamilyMember(member);
      setMembers(prev => [...prev, member]);
      return member;
    } catch (err) {
      const errorMessage = 'Failed to add family member';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRelationship = useCallback(async (relationship: Relationship) => {
    try {
      setLoading(true);
      await memoryService.addRelationship(relationship);
      setRelationships(prev => [...prev, relationship]);
      return relationship;
    } catch (err) {
      const errorMessage = 'Failed to add relationship';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMemberById = useCallback((id: string) => {
    return members.find(member => member.id === id);
  }, [members]);

  const getRelationships = useCallback((memberId: string) => {
    return relationships.filter(
      rel => rel.from === memberId || rel.to === memberId
    );
  }, [relationships]);

  return {
    members,
    relationships,
    loading,
    error,
    addMember,
    addRelationship,
    getMemberById,
    getRelationships,
  };
};