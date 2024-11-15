import { BaseMetadata } from './BaseTypes';

export interface FamilyMember extends BaseMetadata {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthYear: string;
  exactBirthday: string;
  relationship: string;
  generationLevel?: string;
  taxClass?: number;
  relatedTo?: string;
}