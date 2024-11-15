import React, { useState } from 'react';
import { AdminData } from '../../types/admin';

interface Step1Props {
  data: AdminData;
  onNext: (data: Partial<AdminData>) => void;
}

export const Step1: React.FC<Step1Props> = ({ data, onNext }) => {
  const [localData, setLocalData] = useState<Partial<AdminData>>({
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    birthYear: data.birthYear,
    exactBirthday: data.exactBirthday,
    country: data.country
  });
  const [showExactBirthday, setShowExactBirthday] = useState(!!data.exactBirthday);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const toggleBirthdayType = () => {
    setShowExactBirthday(!showExactBirthday);
    if (showExactBirthday) {
      setLocalData(prev => ({ ...prev, exactBirthday: '', birthYear: prev.birthYear || '' }));
    } else {
      setLocalData(prev => ({ ...prev, birthYear: '', exactBirthday: prev.exactBirthday || '' }));
    }
  };

  const isFormValid = () => {
    return (
      localData.firstName &&
      localData.lastName &&
      localData.gender &&
      localData.country &&
      (localData.birthYear || localData.exactBirthday)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onNext(localData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please provide your basic information to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={localData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={localData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={localData.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={localData.country}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {showExactBirthday ? 'Exact Birthday' : 'Birth Year'}
              </label>
              {showExactBirthday ? (
                <input
                  type="date"
                  name="exactBirthday"
                  value={localData.exactBirthday || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              ) : (
                <input
                  type="number"
                  name="birthYear"
                  value={localData.birthYear || ''}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              )}
              <button
                type="button"
                onClick={toggleBirthdayType}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Switch to {showExactBirthday ? 'Birth Year' : 'Exact Birthday'}
              </button>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={!isFormValid()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};