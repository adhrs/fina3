import React from 'react';
import { FamilyMember, AdminData } from '../../types/FamilyTypes';
import { MarriageConnector } from './MarriageConnector';
import { MemberCard } from './MemberCard';

interface SpouseSectionLogicProps {
  member: FamilyMember | AdminData;
  spouse?: FamilyMember;
  onEdit?: (member: FamilyMember | AdminData) => void;
  onDelete?: (id: string) => void;
  onAddRelation?: (member: FamilyMember | AdminData) => void;
}

export const SpouseSectionLogic: React.FC<SpouseSectionLogicProps> = ({
  member,
  spouse,
  onEdit,
  onDelete,
  onAddRelation
}) => {
  return (
    <div className="flex items-center justify-start gap-4 min-w-0">
      <div className="w-[350px] min-w-[350px]">
        <MemberCard
          member={member}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddRelation={onAddRelation}
        />
      </div>
      
      {spouse && (
        <>
          <MarriageConnector />
          <div className="w-[350px] min-w-[350px]">
            <MemberCard
              member={spouse}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddRelation={onAddRelation}
            />
          </div>
        </>
      )}
    </div>
  );
};