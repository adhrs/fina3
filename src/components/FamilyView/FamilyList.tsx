import React from 'react';
import { Plus } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyTypes';
import { FamilyCard } from './FamilyCard';

interface FamilyListProps {
  members: FamilyMember[];
  onAddMember: () => void;
  onViewDetails: (memberId: string) => void;
}

export const FamilyList: React.FC<FamilyListProps> = ({ 
  members, 
  onAddMember,
  onViewDetails 
}) => {
  // Create a Set of unique IDs to ensure no duplicates
  const uniqueMembers = Array.from(new Map(members.map(m => [m.id, m])).values());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Family Members</h2>
          <p className="text-sm text-gray-500 mt-1">
            {uniqueMembers.length} {uniqueMembers.length === 1 ? 'member' : 'members'}
          </p>
        </div>
        <button
          onClick={onAddMember}
          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add family member"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueMembers.map((member) => (
          <FamilyCard 
            key={member.id} 
            member={member}
            onClick={() => onViewDetails(member.id)}
          />
        ))}
        {uniqueMembers.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No family members added yet</p>
            <button
              onClick={onAddMember}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first family member
            </button>
          </div>
        )}
      </div>
    </div>
  );
};