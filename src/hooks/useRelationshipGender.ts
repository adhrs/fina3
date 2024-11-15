import { useState } from 'react';

export const useRelationshipGender = () => {
  const [showGenderField, setShowGenderField] = useState(false);

  const determineGender = (relationship: string) => {
    let gender = '';

    if (relationship === 'Spouse') {
      setShowGenderField(true);
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
      }
    }

    return gender;
  };

  return {
    showGenderField,
    determineGender
  };
};