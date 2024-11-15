import React, { useState } from 'react';
import { AdminData, FamilyMember } from '../../types/admin';
import { useRelationshipGender } from '../../hooks/useRelationshipGender';

interface Step2Props {
  adminData: AdminData;
  updateAdminData: (data: Partial<AdminData>) => void;
  onNext: (familyBox: FamilyMember[]) => void;
  onSkip: () => void;
  onBack: () => void;
}

const MAX_FAMILY_MEMBERS = 5;

export const Step2: React.FC<Step2Props> = ({ 
  adminData, 
  updateAdminData, 
  onNext, 
  onSkip, 
  onBack 
}) => {
  const [familyBox, setFamilyBox] = useState<FamilyMember[]>(adminData.familyBox || []);
  const { showGenderField, determineGender } = useRelationshipGender();

  const handleAddMember = () => {
    if (familyBox.length < MAX_FAMILY_MEMBERS) {
      const newMember: FamilyMember = {
        id: crypto.randomUUID(),
        firstName: '',
        lastName: '',
        relationship: '',
        birthYear: '',
        exactBirthday: '',
        gender: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFamilyBox([...familyBox, newMember]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setFamilyBox(familyBox.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof FamilyMember, value: string) => {
    const updatedMembers = [...familyBox];
    updatedMembers[index] = { 
      ...updatedMembers[index], 
      [field]: value,
      updatedAt: new Date().toISOString()
    };

    if (field === 'relationship') {
      const gender = determineGender(value);
      if (gender) {
        updatedMembers[index].gender = gender;
      }
    }

    setFamilyBox(updatedMembers);
  };

  const isFormValid = () => {
    return familyBox.every(member => 
      member.firstName && 
      member.lastName && 
      member.relationship && 
      (member.birthYear || member.exactBirthday) &&
      (member.relationship !== 'Spouse' || member.gender)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(familyBox);
    }
  };

  const hasSpouse = familyBox.some(member => member.relationship === 'Spouse');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add up to {MAX_FAMILY_MEMBERS} family members or skip this step.
            </p>
          </div>

          {familyBox.length === 0 ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleAddMember}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Family Member
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {familyBox.map((member, index) => (
                <div key={member.id} className="bg-gray-50 p-4 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={member.firstName}
                        onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <select
                        value={member.relationship}
                        onChange={(e) => handleInputChange(index, 'relationship', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Spouse" disabled={hasSpouse && member.relationship !== 'Spouse'}>
                          Spouse
                        </option>
                        <option value="Daughter">Daughter</option>
                        <option value="Son">Son</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>
                    </div>

                    {showGenderField && member.relationship === 'Spouse' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <select
                          value={member.gender}
                          onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Birth Year</label>
                      <input
                        type="number"
                        value={member.birthYear}
                        onChange={(e) => handleInputChange(index, 'birthYear', e.target.value)}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required={!member.exactBirthday}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {familyBox.length < MAX_FAMILY_MEMBERS && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Another Family Member
                </button>
              )}

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};