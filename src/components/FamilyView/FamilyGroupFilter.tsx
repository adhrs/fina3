import React from 'react';
import { Filter } from 'lucide-react';

export type FamilyGroup = 'all' | 'admin' | 'spouse' | 'parents' | 'children' | 'siblings';

interface FamilyGroupFilterProps {
  activeGroup: FamilyGroup;
  counts: Record<FamilyGroup, number>;
  onGroupChange: (group: FamilyGroup) => void;
}

export const FamilyGroupFilter: React.FC<FamilyGroupFilterProps> = ({
  activeGroup,
  counts,
  onGroupChange,
}) => {
  const groups: Array<{ id: FamilyGroup; label: string }> = [
    { id: 'all', label: 'All Members' },
    { id: 'admin', label: 'Admin' },
    { id: 'spouse', label: 'Spouse' },
    { id: 'parents', label: 'Parents' },
    { id: 'children', label: 'Children' },
    { id: 'siblings', label: 'Siblings' },
  ];

  return (
    <div className="flex items-center space-x-2 mb-6">
      <Filter className="w-5 h-5 text-gray-400" />
      <div className="flex space-x-2">
        {groups.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onGroupChange(id)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${activeGroup === id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {label}
            <span className="ml-1 text-gray-500">({counts[id]})</span>
          </button>
        ))}
      </div>
    </div>
  );
};