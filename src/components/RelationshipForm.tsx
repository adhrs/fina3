import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { FamilyMember, Relationship, RelationType } from '../types/FamilyTypes';

interface RelationshipFormProps {
  members: FamilyMember[];
  onSubmit: (relationship: Relationship) => void;
  onCancel: () => void;
  currentMemberId?: string;
}

export const RelationshipForm: React.FC<RelationshipFormProps> = ({
  members,
  onSubmit,
  onCancel,
  currentMemberId
}) => {
  const [formData, setFormData] = useState<Partial<Relationship>>({
    type: '' as RelationType,
    from: currentMemberId || '',
    to: '',
  });

  const currentMemberRelationships = useMemo(() => {
    if (!currentMemberId) return [];
    return members
      .filter(m => m.id === currentMemberId)
      .map(m => ({
        id: m.id,
        relationships: members
          .filter(other => other.id !== m.id)
          .map(other => ({
            memberId: other.id,
            type: formData.type
          }))
      }));
  }, [currentMemberId, members, formData.type]);

  const hasSpouse = currentMemberRelationships.some(r => 
    r.relationships.some(rel => rel.type === 'Spouse')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.from || !formData.to) return;
    
    onSubmit({
      ...formData,
      id: crypto.randomUUID(),
      type: formData.type as RelationType,
      from: formData.from,
      to: formData.to,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Add Relationship</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Relationship Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as RelationType })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select relationship</option>
          <option value="Father">Father</option>
          <option value="Mother">Mother</option>
          <option value="Spouse" disabled={hasSpouse && formData.type !== 'Spouse'}>Spouse</option>
          <option value="Daughter">Daughter</option>
          <option value="Son">Son</option>
          <option value="Brother">Brother</option>
          <option value="Sister">Sister</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">From Member</label>
        <select
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select member...</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">To Member</label>
        <select
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select member...</option>
          {members
            .filter((member) => member.id !== formData.from)
            .map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
        </select>
      </div>

      {formData.type === 'Spouse' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Marriage Date</label>
          <input
            type="date"
            value={formData.marriageDate || ''}
            onChange={(e) => setFormData({ ...formData, marriageDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
          disabled={!formData.type || !formData.from || !formData.to}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Relationship
        </button>
      </div>
    </form>
  );
};