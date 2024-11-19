/**
 * AdvancedMemberOptions
 * 
 * Eine Komponente für erweiterte Familienmitglied-Optionen.
 * Nur für Admin-User zugänglich.
 * Verwaltet spezielle Informationen wie:
 * - Adoptionsstatus
 * - Stiefkind-Status
 * - Adoptionsdatum
 * 
 * @component
 * @example
 * <AdvancedMemberOptions
 *   isOpen={isOpen}
 *   onToggle={handleToggle}
 *   formData={formData}
 *   onChange={handleChange}
 * />
 */

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FamilyMember } from '../../../types/FamilyTypes';
import { isAdmin } from '../../../types/UserTypes';

interface AdvancedMemberOptionsProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: Partial<FamilyMember>;
  onChange: (updates: Partial<FamilyMember>) => void;
}

export const AdvancedMemberOptions: React.FC<AdvancedMemberOptionsProps> = ({
  isOpen,
  onToggle,
  formData,
  onChange
}) => {
  const { user } = useAuth();
  const isUserAdmin = user && isAdmin(user);

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        aria-expanded={isOpen}
      >
        <svg
          className={`mr-2 h-5 w-5 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Advanced Options
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {!isUserAdmin ? (
            <p className="text-sm text-gray-500 italic">
              Only administrators can modify advanced member information.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isAdopted"
                  checked={formData.isAdopted || false}
                  onChange={(e) => onChange({ isAdopted: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={!isUserAdmin}
                />
                <label htmlFor="isAdopted" className="text-sm text-gray-700">
                  Adopted Child
                </label>
              </div>

              {formData.isAdopted && (
                <div>
                  <label htmlFor="adoptionDate" className="block text-sm font-medium text-gray-700">
                    Adoption Date
                  </label>
                  <input
                    type="date"
                    id="adoptionDate"
                    value={formData.adoptionDate || ''}
                    onChange={(e) => onChange({ adoptionDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={!isUserAdmin}
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isStepChild"
                  checked={formData.isStepChild || false}
                  onChange={(e) => onChange({ isStepChild: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={!isUserAdmin}
                />
                <label htmlFor="isStepChild" className="text-sm text-gray-700">
                  Step Child
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 