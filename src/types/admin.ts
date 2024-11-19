import { RelationshipType } from './relationshipTypes';
import { TrackingMetadata } from './tracking';
import { BasicRelationship } from './FamilyTypes';

export type Gender = 'male' | 'female' | 'other' | '';

export interface BasePerson {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: string;
  exactBirthday: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember extends TrackingMetadata {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthYear: string;
  exactBirthday: string;
  relationship: BasicRelationship;
  relationshipDescription?: string;
  generationLevel?: string;
  taxClass?: number;
  relatedTo: string | null;
  universeId: string;
}

export interface Asset extends TrackingMetadata {
  type: 'company' | 'personal';
  name?: string;
  companyType?: string;
  assetType?: string;
  realEstateType?: string;
  realEstateName?: string;
  otherAssetType?: string;
  otherAssetName?: string;
  country: string;
  universeId: string;
}

export interface AdminData extends TrackingMetadata {
  firstName: string;
  lastName: string;
  gender: string;
  birthYear: string;
  exactBirthday: string;
  country: string;
  familyBox: FamilyMember[];
  assetBox: Asset[];
  generationLevel: string;
  universeId: string;
  role: 'admin';
  status: 'active';
  settings: {
    defaultCurrency: string;
    defaultLanguage: string;
    timezone: string;
  };
}

export interface GenerationInfo {
  generationLevel: string;
  inheritanceTaxClass: 1 | 2 | 3;
}

export interface EnrichedFamilyMember extends Omit<FamilyMember, 'generationLevel'>, GenerationInfo {
  children?: string[];
  parents?: string[];
  siblings?: string[];
  spouse?: string;
}