export type DirectRelative = 
  | 'Father'
  | 'Mother'
  | 'Son'
  | 'Daughter';

export type StepRelative = 
  | 'Stepfather'
  | 'Stepmother'
  | 'Stepson'
  | 'Stepdaughter'
  | 'Stepbrother'
  | 'Stepsister';

export type InLawRelative =
  | 'Father-in-law'
  | 'Mother-in-law';

export type ExtendedRelative =
  | 'Grandfather'
  | 'Grandmother'
  | 'Great-Grandfather'
  | 'Great-Grandmother'
  | 'Grandson'
  | 'Granddaughter'
  | 'Great-Grandson'
  | 'Great-Granddaughter'
  | 'Brother'
  | 'Sister'
  | 'Nephew'
  | 'Niece'
  | 'Great-Nephew'
  | 'Great-Niece';

export type AdoptedRelative =
  | 'Adopted-Son'
  | 'Adopted-Daughter';

export type SpouseStatus =
  | 'Spouse'
  | 'Ex-Spouse';

export type RelationshipType = 
  | 'Admin'
  | DirectRelative
  | StepRelative
  | InLawRelative
  | ExtendedRelative
  | AdoptedRelative
  | SpouseStatus
  | 'Other'
  | '';