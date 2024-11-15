/**
 * @fileoverview Future implementation of generic section ordering hook
 * TODO: This is a planned implementation - NOT CURRENTLY IN USE
 * Will be integrated when generic section ordering is needed across multiple views
 */

import { useState, useEffect } from 'react';

export interface OrderableSection {
  id: string;
  title: string;
}

export const useSectionOrder = <T extends string>(
  userId: string,
  viewType: string,
  defaultOrder: T[]
) => {
  const storageKey = `section_order_${viewType}_${userId}`;

  const [sectionOrder, setSectionOrder] = useState<T[]>(() => {
    const savedOrder = localStorage.getItem(storageKey);
    return savedOrder ? JSON.parse(savedOrder) : defaultOrder;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sectionOrder));
  }, [sectionOrder, storageKey]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    setSectionOrder(prevOrder => {
      const newOrder = [...prevOrder];
      const [movedSection] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedSection);
      return newOrder;
    });
  };

  const resetToDefault = () => {
    setSectionOrder(defaultOrder);
  };

  const orderSections = <S extends { section: T }>(sections: S[]): S[] => {
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