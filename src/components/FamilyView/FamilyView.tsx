import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyTypes';
import { MemberCard } from './MemberCard';
import { MemberForm } from './MemberForm';
import { RelatedMemberForm } from './RelatedMemberForm';
import { MemberDetails } from './MemberDetails';
import { SpouseSectionLogic } from './SpouseSectionLogic';
import { useAuth } from '../../contexts/AuthContext';
import { groupFamilyMembers } from '../../utils/familyGroupingUtils';

export const FamilyView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [formType, setFormType] = useState<'new' | 'related'>('new');
  const [searchQuery, setSearchQuery] = useState('');

  const admin = user?.adminData;
  // Only include familyBox members, handle admin separately
  const familyMembers = admin?.familyBox || [];

  // Use the groupFamilyMembers utility to organize members
  const groupedMembers = groupFamilyMembers(familyMembers);

  const findSpouse = (member: FamilyMember): FamilyMember | undefined => {
    return familyMembers.find(m => 
      m.relatedTo === member.id && m.relationship === 'Spouse'
    );
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setFormType('new');
    setShowForm(true);
  };

  const handleAddRelation = (baseMember: FamilyMember) => {
    setSelectedMember(baseMember);
    setFormType('related');
    setShowForm(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  const handleDeleteMember = (id: string) => {
    if (!user?.adminData) return;
    
    const updatedFamilyBox = user.adminData.familyBox.filter(member => member.id !== id);
    const updatedAdminData = {
      ...user.adminData,
      familyBox: updatedFamilyBox
    };
    
    updateUser({
      ...user,
      adminData: updatedAdminData
    });
  };

  const handleSubmitMember = (member: FamilyMember) => {
    if (!user?.adminData) return;

    const updatedFamilyBox = [...user.adminData.familyBox, member];
    const updatedAdminData = {
      ...user.adminData,
      familyBox: updatedFamilyBox
    };

    updateUser({
      ...user,
      adminData: updatedAdminData
    });

    setShowForm(false);
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    if (!user?.adminData) return;

    const updatedFamilyBox = user.adminData.familyBox.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    );

    const updatedAdminData = {
      ...user.adminData,
      familyBox: updatedFamilyBox
    };

    updateUser({
      ...user,
      adminData: updatedAdminData
    });

    setShowDetails(false);
  };

  const filteredGroups = groupedMembers
    .map(group => ({
      ...group,
      members: group.members.filter(member => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          member.firstName.toLowerCase().includes(searchTerm) ||
          member.lastName.toLowerCase().includes(searchTerm) ||
          member.relationship.toLowerCase().includes(searchTerm)
        );
      })
    }))
    .filter(group => group.members.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Family Members</h2>
          <p className="text-sm text-gray-500 mt-1">
            {familyMembers.length} members
          </p>
        </div>
        <button
          onClick={handleAddMember}
          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search family members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-6">
        {/* Admin section */}
        {admin && (
          <div className="p-4 border-2 border-blue-200 rounded-lg bg-white shadow-sm bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]">
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Administrator
            </h3>
            <div className="overflow-x-auto">
              <SpouseSectionLogic
                member={admin}
                spouse={findSpouse(admin)}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                onAddRelation={handleAddRelation}
              />
            </div>
          </div>
        )}

        {/* Other sections */}
        {filteredGroups.map(group => (
          <div 
            key={group.section} 
            className="p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {group.title}
            </h3>
            <div className="space-y-6 overflow-x-auto">
              {group.members.map(member => (
                <SpouseSectionLogic
                  key={member.id}
                  member={member}
                  spouse={findSpouse(member)}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onAddRelation={handleAddRelation}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {formType === 'new' ? (
              <MemberForm
                onSubmit={handleSubmitMember}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <RelatedMemberForm
                members={[admin!, ...familyMembers]}
                baseMember={selectedMember!}
                onSubmit={handleSubmitMember}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}

      {showDetails && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <MemberDetails
              member={selectedMember}
              onClose={() => setShowDetails(false)}
              onEdit={handleUpdateMember}
            />
          </div>
        </div>
      )}
    </div>
  );
};