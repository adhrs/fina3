import { RelationshipType } from '../types/relationshipTypes';

/**
 * Determines the actual relationship based on the parent's relationship
 */
export const determineActualRelationship = (
  selectedRelationship: RelationshipType,
  parentRelationship: RelationshipType
): RelationshipType => {
  // Children of children become grandchildren
  if (parentRelationship === 'Daughter' || parentRelationship === 'Son') {
    if (selectedRelationship === 'Son') return 'Grandson';
    if (selectedRelationship === 'Daughter') return 'Granddaughter';
  }
  
  // Children of siblings become nieces/nephews
  if (parentRelationship === 'Brother' || parentRelationship === 'Sister') {
    if (selectedRelationship === 'Son') return 'Nephew';
    if (selectedRelationship === 'Daughter') return 'Niece';
  }

  // Children of nieces/nephews become great-nieces/great-nephews
  if (parentRelationship === 'Nephew' || parentRelationship === 'Niece') {
    if (selectedRelationship === 'Son') return 'Great-Nephew';
    if (selectedRelationship === 'Daughter') return 'Great-Niece';
  }

  // Children of grandchildren become great-grandchildren
  if (parentRelationship === 'Grandson' || parentRelationship === 'Granddaughter') {
    if (selectedRelationship === 'Son') return 'Great-Grandson';
    if (selectedRelationship === 'Daughter') return 'Great-Granddaughter';
  }

  // Children of great-grandchildren become great-great-grandchildren
  if (parentRelationship === 'Great-Grandson' || parentRelationship === 'Great-Granddaughter') {
    if (selectedRelationship === 'Son') return 'Great-Great-Grandson';
    if (selectedRelationship === 'Daughter') return 'Great-Great-Granddaughter';
  }

  return selectedRelationship;
};