import React from 'react';
import Tree from 'react-d3-tree';
import { FamilyMember } from '../types/FamilyTypes';
import { getGenerationLevel, GENERATION_LEVELS } from '../utils/generationUtils';
import { MemberCard } from './FamilyView/MemberCard';

interface TreeNodeProps {
  member: FamilyMember;
  onMemberClick: (member: FamilyMember) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ member, onMemberClick }) => {
  return (
    <div 
      onClick={() => onMemberClick(member)}
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <MemberCard member={member} onClick={() => onMemberClick(member)} />
    </div>
  );
};

interface FamilyTreeViewProps {
  data: FamilyMember[];
  onMemberClick: (member: FamilyMember) => void;
}

export const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({ data, onMemberClick }) => {
  const transformData = (members: FamilyMember[]) => {
    if (members.length === 0) return null;
    
    const root = members[0];
    const children = members.slice(1).map(member => ({
      name: member.name,
      attributes: {
        birthDate: member.birthDate,
        gender: member.gender,
        relationship: member.relationship,
        generationLevel: member.relationship ? getGenerationLevel(member.relationship) : GENERATION_LEVELS.ADMIN_SPOUSE,
      },
      children: [],
    }));

    return {
      name: root.name,
      attributes: {
        birthDate: root.birthDate,
        gender: root.gender,
        relationship: 'Admin',
        generationLevel: GENERATION_LEVELS.ADMIN_SPOUSE,
      },
      children,
    };
  };

  const treeData = transformData(data);

  if (!treeData) {
    return (
      <div className="p-8 bg-white rounded-lg shadow text-center">
        <p className="text-gray-500">Add family members to start building your tree</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow" style={{ height: '600px' }}>
      <Tree 
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 400, y: 50 }}
        nodeSize={{ x: 200, y: 100 }}
        renderCustomNodeElement={({ nodeDatum }: any) => (
          <g>
            <circle r="20" fill="#4F46E5" />
            <text
              dy=".31em"
              x={30}
              textAnchor="start"
              className="text-sm"
              style={{ fill: '#374151', fontFamily: 'Inter' }}
            >
              {nodeDatum.name}
            </text>
            {nodeDatum.attributes && (
              <>
                <text
                  dy="1.31em"
                  x={30}
                  textAnchor="start"
                  className="text-xs"
                  style={{ fill: '#6B7280', fontFamily: 'Inter' }}
                >
                  {nodeDatum.attributes.relationship}
                </text>
                <text
                  dy="2.31em"
                  x={30}
                  textAnchor="start"
                  className="text-xs"
                  style={{ fill: '#6B7280', fontFamily: 'Inter' }}
                >
                  {nodeDatum.attributes.birthDate}
                </text>
              </>
            )}
          </g>
        )}
      />
    </div>
  );
};