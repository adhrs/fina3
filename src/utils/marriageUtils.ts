import { MarriageData } from '../types/FamilyTypes';
import { v4 as uuidv4 } from 'uuid';

export const createMarriageData = (date?: string): MarriageData => {
  return {
    id: uuidv4(),
    date: date || null,
    status: 'current',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const ensureMarriageData = (marriageData?: MarriageData | null): MarriageData => {
  if (!marriageData) {
    return createMarriageData();
  }
  if (!marriageData.id) {
    return {
      ...marriageData,
      id: uuidv4(),
      createdAt: marriageData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  return marriageData;
}; 