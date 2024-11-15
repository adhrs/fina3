import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { FamilyMember } from '../../types/FamilyTypes';

interface MemberDetailsProps {
  member: FamilyMember;
  onClose: () => void;
  onEdit: (member: FamilyMember) => void;
}

export const MemberDetails: React.FC<MemberDetailsProps> = ({ 
  member, 
  onClose,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    gender: member.gender,
    birthYear: member.birthYear,
    exactBirthday: member.exactBirthday,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      ...member,
      ...formData,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const hasChanges = () => {
    return (
      formData.firstName !== member.firstName ||
      formData.lastName !== member.lastName ||
      formData.gender !== member.gender ||
      formData.birthYear !== member.birthYear ||
      formData.exactBirthday !== member.exactBirthday
    );
  };

  const isAdmin = member.relationship === 'Admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {isAdmin ? 'Admin Details' : 'Member Details'}
        </h3>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{member.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{member.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-900 capitalize">{member.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birth Year
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{member.birthYear}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Exact Birthday
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.exactBirthday}
                onChange={(e) => setFormData({ ...formData, exactBirthday: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {member.exactBirthday ? new Date(member.exactBirthday).toLocaleDateString() : 'Not specified'}
              </p>
            )}
          </div>

          {/* Always show relationship but make it read-only */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {isAdmin ? 'Administrator' : member.relationship}
            </p>
          </div>

          {isEditing && (
            <div className="sm:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasChanges()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};