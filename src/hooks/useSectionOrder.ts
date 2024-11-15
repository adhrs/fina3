import { useState, useEffect } from 'react';
import { FamilySection } from '../utils/familyGroupingUtils';

const DEFAULT_SECTION_ORDER: FamilySection[] = [
  'admin',
  'spouse',
  'children',
  'grandchildren',
  'greatGrandchildren',
  'parents',
  'inLawParents',
  'grandparents',
  'siblings',
  'siblingsChildren',
  'siblingsGrandchildren',
  'other'
];

export const useSectionOrder = (userId: string) => {
  const [sectionOrder, setSectionOrder] = useState<FamilySection[]>(() => {
    const savedOrder = localStorage.getItem(`familySection_order_${userId}`);
    return savedOrder ? JSON.parse(savedOrder) : DEFAULT_SECTION_ORDER;
  });

  useEffect(() => {
    localStorage.setItem(`familySection_order_${userId}`, JSON.stringify(sectionOrder));
  }, [sectionOrder, userId]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    setSectionOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const [movedSection] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedSection);
      return newOrder;
    });
  };

  const resetToDefault = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
  };

  const orderSections = <T extends { section: FamilySection }>(sections: T[]): T[] => {
    return [...sections].sort((a, b) => {
      const indexA = sectionOrder.indexOf(a.section);
      const indexB = sectionOrder.indexOf(b.section);
      return indexA - indexB;
    });
  };

  return {
    sectionOrder,
    moveSection,
    resetToDefault,
    orderSections
  };
};