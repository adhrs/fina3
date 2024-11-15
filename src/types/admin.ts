import { RelationshipType } from './relationshipTypes';
import { TrackingMetadata } from './tracking';

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

export interface FamilyMember extends BasePerson {
  relationship: RelationshipType;
  generationLevel?: string;
  taxClass?: number;
}

export interface Asset {
  id: string;
  type: 'company' | 'personal';
  name?: string;
  companyType?: string;
  country?: string;
  assetType?: string;
  realEstateType?: string;
  realEstateName?: string;
  otherAssetType?: string;
  otherAssetName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminData extends BasePerson, TrackingMetadata {
  country: string;
  generationLevel: string;
  familyBox: FamilyMember[];
  assetBox: Asset[];
}

export interface GenerationInfo {
  generationLevel: string;
  inheritanceTaxClass: 1 | 2 | 3;
}

export interface EnrichedFamilyMember extends FamilyMember, GenerationInfo {
  children?: string[];
  parents?: string[];
  siblings?: string[];
  spouse?: string;
}