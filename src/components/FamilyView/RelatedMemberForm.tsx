import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyTypes';
import { useRelationshipGender } from '../../hooks/useRelationshipGender';
import { useFamilyRelationships } from '../../hooks/useFamilyRelationships';

interface RelatedMemberFormProps {
  onSubmit: (member: FamilyMember) => void;
  onCancel: () => void;
  members: FamilyMember[];
  baseMember: FamilyMember;
}

export const RelatedMemberForm: React.FC<RelatedMemberFormProps> = ({ 
  onSubmit, 
  onCancel,
  members,
  baseMember
}) => {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    firstName: '',
    lastName: '',
    relationship: '',
    birthYear: '',
    exactBirthday: '',
    gender: '',
  });

  const { showGenderField, determineGender } = useRelationshipGender();
  const { getAvailableRelationships } = useFamilyRelationships(members);

  const handleRelationshipChange = (relationship: string) => {
    const gender = determineGender(relationship);
    setFormData(prev => ({
      ...prev,
      relationship,
      gender: gender || prev.gender
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.relationship) return;

    const now = new Date().toISOString();
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      relationship: formData.relationship,
      birthYear: formData.birthYear || '',
      exactBirthday: formData.exactBirthday || '',
      gender: formData.gender as 'male' | 'female' | 'other',
      relatedTo: baseMember.id,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    onSubmit(newMember);
  };

  // Get available relationships for the base member
  const availableRelationships = getAvailableRelationships(baseMember.id);

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Add Family Member</h3>
          <p className="text-sm text-gray-500 mt-1">
            Related to: {baseMember.firstName} {baseMember.lastName} ({baseMember.relationship})
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Relationship to {baseMember.firstName}
        </label>
        <select
          required
          value={formData.relationship}
          onChange={(e) => handleRelationshipChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select relationship</option>
          {availableRelationships.map(rel => (
            <option key={rel} value={rel}>{rel}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          required
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Birth Year</label>
        <input
          type="text"
          value={formData.birthYear}
          onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Exact Birthday</label>
        <input
          type="date"
          value={formData.exactBirthday}
          onChange={(e) => setFormData({ ...formData, exactBirthday: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {showGenderField && formData.relationship === 'Spouse' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>
    </form>
  );
};