import { BaseMetadata } from './BaseTypes';

export type BasicRelationship = 
  | 'Father'
  | 'Mother'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Spouse';

export interface FamilyMember extends BaseMetadata {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthYear: string;
  exactBirthday: string;
  relationship: BasicRelationship;
  relationshipDescription?: string;
  generationLevel?: string;
  taxClass?: number;
  relatedTo?: string;
  creator?: string;
  universeId?: string;
}

export const familyValidation = {
  isDuplicate: (newMember: FamilyMember, members: FamilyMember[]): boolean => {
    return members.some(member => 
      member.relationship === newMember.relationship && 
      member.relatedTo === newMember.relatedTo
    );
  }
};