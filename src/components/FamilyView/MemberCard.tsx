import React from 'react';
import { BaseCard } from '../shared/BaseCard';
import { FamilyMember } from '../../types/FamilyTypes';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MemberCardProps {
  member: FamilyMember;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
  onAddRelation?: (member: FamilyMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ 
  member,
  onEdit,
  onDelete,
  onAddRelation
}) => {
  const { user } = useAuth();
  const adminData = user?.adminData;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getColorClass = (relationship: string) => {
    const colors = {
      'Admin': 'bg-blue-100 text-blue-800',
      'Spouse': 'bg-pink-100 text-pink-800',
      'Father': 'bg-green-100 text-green-800',
      'Mother': 'bg-green-100 text-green-800',
      'Son': 'bg-purple-100 text-purple-800',
      'Daughter': 'bg-purple-100 text-purple-800',
      'Brother': 'bg-yellow-100 text-yellow-800',
      'Sister': 'bg-yellow-100 text-yellow-800',
      'Ex-Spouse': 'bg-gray-100 text-gray-800',
    };
    return colors[relationship as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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

  const getContextualRelationship = () => {
    if (member.relationship === 'Admin') return 'Administrator';
    
    // Find who this member is related to
    const relatedMember = adminData?.familyBox?.find(m => m.id === member.relatedTo);
    if (!relatedMember) {
      // If no related member found but it's a Son/Daughter of Father/Mother, 
      // it's admin's sibling
      if ((member.relationship === 'Son' || member.relationship === 'Daughter') &&
          member.relatedTo && 
          adminData?.familyBox?.some(m => 
            m.id === member.relatedTo && 
            (m.relationship === 'Father' || m.relationship === 'Mother')
          )) {
        return `Thomas's ${member.relationship === 'Son' ? 'Brother' : 'Sister'}`;
      }
      return member.relationship;
    }

    // Handle spouse's relatives
    if (relatedMember.relationship === 'Spouse') {
      return `${relatedMember.firstName}'s ${member.relationship}`;
    }

    // Handle parent's children (admin's siblings)
    if ((relatedMember.relationship === 'Father' || relatedMember.relationship === 'Mother') &&
        (member.relationship === 'Son' || member.relationship === 'Daughter')) {
      return `Thomas's ${member.relationship === 'Son' ? 'Brother' : 'Sister'}`;
    }

    return member.relationship;
  };

  const getSubtitle = () => {
    const birthInfo = member.exactBirthday || member.birthYear;
    const relationship = getContextualRelationship();
    
    if (!birthInfo) return relationship;
    if (!relationship) return `Born ${birthInfo}`;
    return `Born ${birthInfo} • ${relationship}`;
  };

  return (
    <BaseCard
      title={`${member.firstName} ${member.lastName}`}
      subtitle={getSubtitle()}
      icon={icon}
      actions={actions}
      onEdit={onEdit ? () => onEdit(member) : undefined}
      onDelete={member.relationship !== 'Admin' && onDelete ? () => onDelete(member.id) : undefined}
    />
  );
};