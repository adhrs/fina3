import { RelationshipType } from '../types/admin';

export interface InheritanceRelation {
  fromPerson: string;  // ID of the person being inherited from
  toPerson: string;    // ID of the inheriting person
  assetOwner?: string; // Optional: Original owner of the assets
}

/**
 * Tax classes according to German Inheritance Tax Law (ErbStG § 15)
 */
export enum TaxClass {
  I = 1,
  II = 2,
  III = 3
}

/**
 * Determines the tax class based on the relationship between testator and heir
 */
export const determineInheritanceTaxClass = (
  relationship: RelationshipType,
  inheritanceRelation: InheritanceRelation
): TaxClass => {
  if (inheritanceRelation.assetOwner && 
      inheritanceRelation.assetOwner !== inheritanceRelation.fromPerson) {
    return determineIndirectInheritanceTaxClass(relationship, inheritanceRelation);
  }

  return getDirectInheritanceTaxClass(relationship);
};

/**
 * Determines the tax class for indirect relationships
 */
const determineIndirectInheritanceTaxClass = (
  relationship: RelationshipType,
  inheritanceRelation: InheritanceRelation
): TaxClass => {
  if (isSpouseRelative(relationship)) {
    return TaxClass.II;
  }

  return TaxClass.III;
};

/**
 * Helper function to check if it's a spouse's relative
 */
const isSpouseRelative = (relationship: RelationshipType): boolean => {
  if (relationship === 'Spouse' || relationship === 'Ex-Spouse') {
    return true;
  }
  
  if (relationship === 'Father-in-law' || relationship === 'Mother-in-law') {
    return true;
  }

  if (relationship === 'Other') {
    return true;
  }

  return false;
};

/**
 * Determines the tax class for direct inheritance
 */
const getDirectInheritanceTaxClass = (relationship: RelationshipType): TaxClass => {
  // Tax Class I - immediate family
  if ([
    'Son',
    'Daughter',
    'Stepson',
    'Stepdaughter',
    'Adopted-Son',
    'Adopted-Daughter',
    'Grandson',
    'Granddaughter',
    'Great-Grandson',
    'Great-Granddaughter',
    'Father',
    'Mother',
    'Grandfather',
    'Grandmother',
    'Great-Grandfather',
    'Great-Grandmother',
    'Spouse'
  ].includes(relationship)) {
    return TaxClass.I;
  }

  // Tax Class II - extended family
  if ([
    'Brother',
    'Sister',
    'Stepbrother',
    'Stepsister',
    'Nephew',
    'Niece',
    'Stepfather',
    'Stepmother',
    'Father-in-law',
    'Mother-in-law'
  ].includes(relationship)) {
    return TaxClass.II;
  }

  // Tax Class III - all others
  return TaxClass.III;
};