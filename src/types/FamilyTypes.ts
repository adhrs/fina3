import { BaseMetadata } from './BaseTypes';
import { RelationshipType } from './relationshipTypes';

export type BasicRelationship = 
  | 'Spouse'
  | 'Father'
  | 'Mother'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister';

export interface MarriageData {
  id: string;
  date?: string | null;
  status: 'current' | 'divorced' | 'deceased';
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember extends BaseMetadata {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthYear: string;
  exactBirthday: string;
  relationship: RelationshipType;
  relationshipDescription?: string;
  generationLevel?: string;
  taxClass?: number;
  relatedTo: string | null;
  universeId: string;
  name?: string;
  isAdopted?: boolean;
  isStepChild?: boolean;
  adoptionDate?: string;
  marriageData?: MarriageData | null;
}

export const familyValidation = {
  isDuplicate: (newMember: FamilyMember, members: FamilyMember[]): boolean => {
    return members.some(member => 
      member.relationship === newMember.relationship && 
      member.relatedTo === newMember.relatedTo
    );
  }
};

export interface Relationship {
  id: string;
  type: RelationshipType;
  from: string;
  to: string;
  marriageData?: MarriageData;
}

export type { RelationshipType };