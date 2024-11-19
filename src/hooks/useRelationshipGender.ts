import { useState } from 'react';

type Gender = 'male' | 'female' | 'other' | undefined;

export const useRelationshipGender = () => {
  const [showGenderField, setShowGenderField] = useState(false);

  const determineGender = (relationship: string): Gender => {
    let gender: Gender;

    if (relationship === 'Spouse') {
      setShowGenderField(true);
      return undefined;
    } else {
      setShowGenderField(false);
      switch (relationship) {
        case 'Father':
        case 'Son':
        case 'Brother':
          gender = 'male';
          break;
        case 'Mother':
        case 'Daughter':
        case 'Sister':
          gender = 'female';
          break;
        default:
          gender = undefined;
      }
    }

    return gender;
  };

  return {
    showGenderField,
    determineGender
  };
};