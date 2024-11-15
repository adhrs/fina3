import { useMemo } from 'react';
import { FamilyMember } from '../types/FamilyTypes';
import { useAuth } from '../contexts/AuthContext';

export const useFamilyRelationships = (members: FamilyMember[]) => {
  const { user } = useAuth();
  const adminId = user?.adminData?.id;

  // Track all existing relationships globally
  const existingRelationships = useMemo(() => {
    return members.reduce((acc, member) => {
      // Track by who they're related to
      if (member.relatedTo) {
        if (!acc[member.relatedTo]) {
          acc[member.relatedTo] = {
            spouses: [],
            fathers: [],
            mothers: [],
            children: [],
            siblings: []
          };
        }

        switch (member.relationship) {
          case 'Spouse':
            acc[member.relatedTo].spouses.push(member.id);
            break;
          case 'Father':
            acc[member.relatedTo].fathers.push(member.id);
            break;
          case 'Mother':
            acc[member.relatedTo].mothers.push(member.id);
            break;
          case 'Son':
          case 'Daughter':
            acc[member.relatedTo].children.push(member.id);
            break;
          case 'Brother':
          case 'Sister':
            acc[member.relatedTo].siblings.push(member.id);
            break;
        }
      }
      return acc;
    }, {} as Record<string, {
      spouses: string[];
      fathers: string[];
      mothers: string[];
      children: string[];
      siblings: string[];
    }>);
  }, [members]);

  const isAdmin = (member: FamilyMember): boolean => {
    return member.id === adminId || member === user?.adminData;
  };

  const getAvailableRelationships = (memberId: string): string[] => {
    const member = members.find(m => m.id === memberId);
    if (!member) return [];

    const memberRelations = existingRelationships[memberId] || {
      spouses: [],
      fathers: [],
      mothers: [],
      children: [],
      siblings: []
    };

    const hasSpouse = memberRelations.spouses.length > 0;
    const hasFather = memberRelations.fathers.length > 0;
    const hasMother = memberRelations.mothers.length > 0;

    const options: string[] = [];

    // Admin can add any relationship except what already exists
    if (isAdmin(member)) {
      if (!hasSpouse) options.push('Spouse');
      if (!hasFather) options.push('Father');
      if (!hasMother) options.push('Mother');
      options.push('Son', 'Daughter', 'Brother', 'Sister');
      return options;
    }

    // Father's available relationships
    if (member.relationship === 'Father') {
      if (!hasSpouse) options.push('Spouse'); // Can add spouse (admin's mother)
      if (!hasFather) options.push('Father'); // Can add his father (admin's grandfather)
      if (!hasMother) options.push('Mother'); // Can add his mother (admin's grandmother)
      options.push('Son', 'Daughter'); // Can add more children (admin's siblings)
      options.push('Brother', 'Sister'); // Can add siblings (admin's uncles/aunts)
      return options;
    }

    // Mother has same options as father
    if (member.relationship === 'Mother') {
      if (!hasSpouse) options.push('Spouse');
      if (!hasFather) options.push('Father');
      if (!hasMother) options.push('Mother');
      options.push('Son', 'Daughter');
      options.push('Brother', 'Sister');
      return options;
    }

    // Sister's available relationships
    if (member.relationship === 'Sister') {
      if (!hasSpouse) options.push('Spouse');
      // Can only add parents if they don't exist in the family tree
      const familyHasFather = members.some(m => m.relationship === 'Father');
      const familyHasMother = members.some(m => m.relationship === 'Mother');
      if (!familyHasFather && !hasFather) options.push('Father');
      if (!familyHasMother && !hasMother) options.push('Mother');
      options.push('Son', 'Daughter'); // Can add children (admin's nieces/nephews)
      return options;
    }

    // Brother has same options as sister
    if (member.relationship === 'Brother') {
      if (!hasSpouse) options.push('Spouse');
      const familyHasFather = members.some(m => m.relationship === 'Father');
      const familyHasMother = members.some(m => m.relationship === 'Mother');
      if (!familyHasFather && !hasFather) options.push('Father');
      if (!familyHasMother && !hasMother) options.push('Mother');
      options.push('Son', 'Daughter');
      return options;
    }

    // Children (Son/Daughter) can only add spouse and their own children
    if (member.relationship === 'Son' || member.relationship === 'Daughter') {
      if (!hasSpouse) options.push('Spouse');
      options.push('Son', 'Daughter');
      return options;
    }

    // Spouse can add parents, siblings, and children
    if (member.relationship === 'Spouse') {
      if (!hasFather) options.push('Father');
      if (!hasMother) options.push('Mother');
      options.push('Brother', 'Sister');
      options.push('Son', 'Daughter');
      return options;
    }

    return options;
  };

  return {
    getAvailableRelationships
  };
};