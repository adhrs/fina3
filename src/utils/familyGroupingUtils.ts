import { FamilyMember } from '../types/FamilyTypes';

export type FamilySection = 
  | 'admin'
  | 'children'
  | 'grandchildren'
  | 'greatGrandchildren'
  | 'parents'
  | 'inLawParents'
  | 'grandparents'
  | 'siblings'
  | 'siblingsChildren'
  | 'siblingsGrandchildren'
  | 'other';

export interface FamilyGroup {
  section: FamilySection;
  title: string;
  members: FamilyMember[];
}

export const groupFamilyMembers = (members: FamilyMember[]): FamilyGroup[] => {
  // Filter out admin from regular grouping
  const nonAdminMembers = members.filter(m => m.relationship !== 'Admin');

  // Find siblings to track their children
  const siblingIds = new Set(
    nonAdminMembers
      .filter(m => m.relationship === 'Brother' || m.relationship === 'Sister')
      .map(m => m.id)
  );

  // Find parents to identify their children (admin's siblings)
  const parentIds = new Set(
    nonAdminMembers
      .filter(m => m.relationship === 'Father' || m.relationship === 'Mother')
      .map(m => m.id)
  );

  const groups: Record<FamilySection, FamilyMember[]> = {
    admin: members.filter(m => m.relationship === 'Admin'),
    children: nonAdminMembers.filter(m => 
      (m.relationship === 'Son' || m.relationship === 'Daughter') && 
      !Array.from(siblingIds).includes(m.relatedTo || '') &&
      !Array.from(parentIds).includes(m.relatedTo || '')
    ),
    grandchildren: nonAdminMembers.filter(m => ['Grandson', 'Granddaughter'].includes(m.relationship)),
    greatGrandchildren: nonAdminMembers.filter(m => ['Great-Grandson', 'Great-Granddaughter'].includes(m.relationship)),
    parents: nonAdminMembers.filter(m => ['Father', 'Mother'].includes(m.relationship)),
    inLawParents: nonAdminMembers.filter(m => ['Father-in-law', 'Mother-in-law'].includes(m.relationship)),
    grandparents: nonAdminMembers.filter(m => [
      'Grandfather', 'Grandmother',
      'Grandfather-in-law', 'Grandmother-in-law'
    ].includes(m.relationship)),
    siblings: nonAdminMembers.filter(m => 
      ['Brother', 'Sister'].includes(m.relationship) ||
      ((m.relationship === 'Son' || m.relationship === 'Daughter') && 
       Array.from(parentIds).includes(m.relatedTo || ''))
    ),
    siblingsChildren: nonAdminMembers.filter(m => 
      (m.relationship === 'Son' || m.relationship === 'Daughter') && 
      Array.from(siblingIds).includes(m.relatedTo || '')
    ),
    siblingsGrandchildren: nonAdminMembers.filter(m => ['Great-Nephew', 'Great-Niece'].includes(m.relationship)),
    other: nonAdminMembers.filter(m => ![
      'Admin', 'Son', 'Daughter',
      'Grandson', 'Granddaughter',
      'Great-Grandson', 'Great-Granddaughter',
      'Father', 'Mother', 'Father-in-law', 'Mother-in-law',
      'Grandfather', 'Grandmother', 'Grandfather-in-law', 'Grandmother-in-law',
      'Brother', 'Sister',
      'Nephew', 'Niece',
      'Great-Nephew', 'Great-Niece',
      'Spouse'
    ].includes(m.relationship))
  };

  return Object.entries(groups)
    .filter(([_, members]) => members.length > 0)
    .map(([section, members]) => ({
      section: section as FamilySection,
      title: getSectionTitle(section as FamilySection),
      members
    }));
};

export const getSectionTitle = (section: FamilySection): string => {
  switch (section) {
    case 'admin':
      return 'Administrator';
    case 'children':
      return 'Children';
    case 'grandchildren':
      return 'Grandchildren';
    case 'greatGrandchildren':
      return 'Great-Grandchildren';
    case 'parents':
      return 'Parents';
    case 'inLawParents':
      return 'Parents in Law';
    case 'grandparents':
      return 'Grandparents';
    case 'siblings':
      return 'Siblings';
    case 'siblingsChildren':
      return 'Nieces & Nephews';
    case 'siblingsGrandchildren':
      return 'Great-Nieces & Great-Nephews';
    case 'other':
      return 'Other Family Members';
  }
};