import React from 'react';
import { BaseCard } from '../shared/BaseCard';
import { FamilyMember } from '../../types/FamilyTypes';
import { UserPlus } from 'lucide-react';

interface MemberCardBaseCardConnectorProps {
  member: FamilyMember;
  getInitials: (firstName?: string, lastName?: string) => string;
  getColorClass: (relationship: string) => string;
  getSubtitle: () => string;
  canEdit: boolean;
  canDelete: boolean;
  canAddRelation: boolean;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
  onAddRelation?: (member: FamilyMember) => void;
}

export const MemberCardBaseCardConnector: React.FC<MemberCardBaseCardConnectorProps> = ({
  member,
  getInitials,
  getColorClass,
  getSubtitle,
  canEdit,
  canDelete,
  canAddRelation,
  onEdit,
  onDelete,
  onAddRelation
}) => {
  const icon = (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${getColorClass(member.relationship)}`}>
      {getInitials(member.firstName, member.lastName)}
    </div>
  );

  const actions = onAddRelation && (
    <button
      onClick={() => onAddRelation(member)}
      className="p-1 text-gray-400 hover:text-blue-600"
      title="Add related member"
    >
      <UserPlus className="w-4 h-4" />
    </button>
  );

  return (
    <BaseCard
      title={member.firstName}
      subtitle={getSubtitle()}
      icon={icon}
      actions={actions}
      onEdit={canEdit && onEdit ? () => onEdit(member) : undefined}
      onDelete={canDelete && member.relationship !== 'Admin' && onDelete ? () => onDelete(member.id) : undefined}
    >
      {member.metadata?.isStep && (
        <span className="text-xs text-gray-500">Step-{member.relationship}</span>
      )}
      {member.metadata?.isAdopted && (
        <span className="text-xs text-gray-500">(Adopted)</span>
      )}
    </BaseCard>
  );
}; 