import { BasicRelationship, FamilyMember } from '../types/FamilyTypes';

export const useFamilyRelationships = (members: FamilyMember[]) => {
  const getAvailableRelationships = (memberId: string): BasicRelationship[] => {
    const member = members.find(m => m.id === memberId);
    if (!member) return [];

    // Basis-Beziehungen basierend auf der Rolle
    let relationships: BasicRelationship[] = [];
    
    switch (member.relationship) {
      case 'Spouse':
        // Spouse kann nur Eltern (in-laws) hinzufügen
        relationships = ['Father', 'Mother'];
        break;
      
      case 'Admin':
        // Admin kann alle Beziehungen hinzufügen
        relationships = [
          'Father',
          'Mother',
          'Son',
          'Daughter',
          'Brother',
          'Sister',
          'Spouse'
        ];
        break;
      
      default:
        // Andere Mitglieder können Eltern und Geschwister hinzufügen
        relationships = [
          'Father',
          'Mother',
          'Brother',
          'Sister'
        ];
    }

    // Filter existierende Beziehungen
    return relationships.filter(rel => {
      // Spouse ist ein Spezialfall - nur eine erlaubt
      if (rel === 'Spouse') {
        return !members.some(m => m.relationship === 'Spouse' && m.relatedTo === memberId);
      }
      return !members.some(m => m.relationship === rel && m.relatedTo === memberId);
    });
  };

  return { getAvailableRelationships };
};