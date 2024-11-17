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

    // Globale Checks
    const familyHasMother = members.some(m => 
      m.relationship === 'Mother' || 
      m.relationshipDescription?.includes("Mother")
    );
    const familyHasFather = members.some(m => 
      m.relationship === 'Father' || 
      m.relationshipDescription?.includes("Father")
    );

    // NEU: Spouse Checks
    const memberHasSpouse = members.some(m => 
      m.relatedTo === memberId && m.relationship === 'Spouse'
    );
    const isSpouseOfMember = members.some(m =>
      member.relatedTo === m.id && member.relationship === 'Spouse'
    );
    const hasSpouse = memberHasSpouse || isSpouseOfMember;

    const options: string[] = [];

    // Admin's Optionen
    if (isAdmin(member)) {
      if (!hasSpouse) options.push('Spouse');
      if (!familyHasFather) options.push('Father');
      if (!familyHasMother) options.push('Mother');
      options.push('Son', 'Daughter');
      return options;
    }

    // Vater's Optionen
    if (member.relationship === 'Father') {
      // Kann nur Spouse hinzufügen wenn keine Mutter existiert
      if (!hasSpouse && !familyHasMother) options.push('Spouse');
      options.push('Son', 'Daughter');
      return options;
    }

    // Mutter's Optionen
    if (member.relationship === 'Mother') {
      // Kann nur Spouse hinzufügen wenn kein Vater existiert
      if (!hasSpouse && !familyHasFather) options.push('Spouse');
      options.push('Son', 'Daughter');
      return options;
    }

    // Geschwister Optionen
    if (member.relationship === 'Brother' || member.relationship === 'Sister') {
      if (!hasSpouse) options.push('Spouse');
      options.push('Son', 'Daughter');
      return options;
    }

    return options;
  };

  return {
    getAvailableRelationships
  };
};