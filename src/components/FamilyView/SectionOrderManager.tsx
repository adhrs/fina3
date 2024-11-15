import React from 'react';
import { Settings } from 'lucide-react';
import { FamilySection } from '../../utils/familyGroupingUtils';

interface SectionOrderManagerProps {
  sectionOrder: FamilySection[];
  onMove: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
}

export const SectionOrderManager: React.FC<SectionOrderManagerProps> = ({
  sectionOrder,
  onMove,
  onReset,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== toIndex) {
      onMove(fromIndex, toIndex);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Section Order</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset to Default
        </button>
      </div>

      <div className="space-y-2">
        {sectionOrder.map((section, index) => (
          <div
            key={section}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-move"
          >
            <span className="font-medium text-gray-700">
              {section}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};