import React from 'react';
import { FamilyTreeContent } from './FamilyTreeContent';
import './styles/tree.css';

export const FamilyTreeView: React.FC = () => {
  return (
    <FamilyTreeContent>
      <div className="w-full h-full">
        {/* Tree visualization will go here */}
        <span>Tree Visualization</span>
      </div>
    </FamilyTreeContent>
  );
};