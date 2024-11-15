import { RelationshipType } from '../types/admin';

/**
 * Generation Level Constants
 * Following German inheritance law structure
 */
export const GENERATION_LEVELS = {
  GREAT_GRANDPARENTS: '-3',    // Urgroßeltern
  GRANDPARENTS: '-2',          // Großeltern
  PARENTS: '-1.0',             // leibliche Eltern
  STEP_PARENTS: '-1.1',        // Stiefeltern/Schwiegereltern
  ADMIN_SPOUSE: '0.0',         // Admin & Ehegatte
  EX_SPOUSE: '0.2',            // Geschiedene(r)
  SIBLINGS: '0.1',             // Geschwister
  CHILDREN: '1.0',             // leibliche/adoptierte Kinder
  NIECES_NEPHEWS: '1.1',       // Nichten/Neffen
  GRANDCHILDREN: '2',          // Enkelkinder
  GREAT_GRANDCHILDREN: '3',    // Urenkel
} as const;

/**
 * Helper functions for deceased family members
 */
export const isDeceased = (relationship: RelationshipType): boolean => {
  return relationship.startsWith('Deceased-');
};

export const getBaseRelationship = (relationship: RelationshipType): RelationshipType => {
  if (isDeceased(relationship)) {
    return relationship.replace('Deceased-', '') as RelationshipType;
  }
  return relationship;
};

/**
 * Determines the generation level based on the relationship
 */
export const getGenerationLevel = (relationship: RelationshipType): string => {
  // Remove "Deceased-" prefix for generation determination
  const baseRelationship = getBaseRelationship(relationship);
  
  switch (baseRelationship) {
    // Admin Level
    case 'Admin':
    case 'Spouse':
      return GENERATION_LEVELS.ADMIN_SPOUSE;

    // Parents Level
    case 'Father':
    case 'Mother':
      return GENERATION_LEVELS.PARENTS;
    
    // Step/In-Law Parents
    case 'Stepfather':
    case 'Stepmother':
    case 'Father-in-law':
    case 'Mother-in-law':
      return GENERATION_LEVELS.STEP_PARENTS;

    // Grandparents
    case 'Grandfather':
    case 'Grandmother':
      return GENERATION_LEVELS.GRANDPARENTS;

    // Great-Grandparents
    case 'Great-Grandfather':
    case 'Great-Grandmother':
      return GENERATION_LEVELS.GREAT_GRANDPARENTS;

    // Children
    case 'Son':
    case 'Daughter':
    case 'Stepson':
    case 'Stepdaughter':
    case 'Adopted-Son':
    case 'Adopted-Daughter':
      return GENERATION_LEVELS.CHILDREN;

    // Grandchildren
    case 'Grandson':
    case 'Granddaughter':
      return GENERATION_LEVELS.GRANDCHILDREN;

    // Great-Grandchildren
    case 'Great-Grandson':
    case 'Great-Granddaughter':
      return GENERATION_LEVELS.GREAT_GRANDCHILDREN;

    // Siblings
    case 'Brother':
    case 'Sister':
    case 'Stepbrother':
    case 'Stepsister':
      return GENERATION_LEVELS.SIBLINGS;

    case 'Ex-Spouse':
      return GENERATION_LEVELS.EX_SPOUSE;

    // Nieces/Nephews
    case 'Nephew':
    case 'Niece':
      return GENERATION_LEVELS.NIECES_NEPHEWS;

    default:
      return GENERATION_LEVELS.ADMIN_SPOUSE; // Fallback
  }
};