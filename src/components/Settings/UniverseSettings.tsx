import React from 'react';
import { Settings, Database, Clock, User, Users, Building2, Shield, Heart } from 'lucide-react';
import { useUniverse } from '../../contexts/UniverseContext';
import { useAuth } from '../../contexts/AuthContext';
import { FamilyMember } from '../../types/FamilyTypes';

export const UniverseSettings: React.FC = () => {
  const { universe } = useUniverse();
  const { user } = useAuth();

  if (!universe || !user) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const renderMetadataSection = (title: string, data: Record<string, any>, icon?: React.ReactNode) => (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      {title && (
        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
          {icon}
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="font-mono text-sm">
            <span className="font-medium text-gray-500">{key}:</span>{' '}
            <span className="text-gray-900">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFamilyMemberSection = (member: FamilyMember) => (
    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
        {member.firstName} {member.lastName}
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderMetadataSection('Basic Information', {
          'Member ID': member.id,
          'Relationship': member.relationship,
          'Gender': member.gender,
          'Birth': member.exactBirthday || member.birthYear
        }, <Users className="w-5 h-5 text-blue-500" />)}

        {renderMetadataSection('Inheritance Information', {
          'Generation Level': member.generationLevel,
          'Tax Class': member.taxClass,
          'Related To': member.relatedTo || 'N/A'
        }, <Shield className="w-5 h-5 text-green-500" />)}

        {(member.relationship === 'Spouse' || member.relationship === 'Mother' || member.relationship === 'Father') 
          && member.marriageData && renderMetadataSection('Marriage Information', {
            'Marriage ID': member.marriageData.id,
            'Marriage Date': member.marriageData.date 
              ? new Date(member.marriageData.date).toLocaleDateString()
              : 'Not Set',
            'Status': member.marriageData.status,
            'Created At': new Date(member.marriageData.createdAt).toLocaleDateString(),
            'Updated At': new Date(member.marriageData.updatedAt).toLocaleDateString()
          }, <Heart className="w-5 h-5 text-red-500" />)}

        {renderMetadataSection('Tracking Information', {
          'Created At': formatDate(member.createdAt),
          'Updated At': formatDate(member.updatedAt),
          'Version': member.version,
          'Created By': member.createdBy || 'System',
          'Updated By': member.updatedBy || 'System'
        }, <Clock className="w-5 h-5 text-orange-500" />)}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-500" />
          Universe Settings
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Current universe configuration and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Universe Metadata */}
        {renderMetadataSection('Universe Metadata', {
          'Universe ID': universe.id,
          'Admin ID': universe.adminId,
          'Created At': formatDate(universe.createdAt),
          'Updated At': formatDate(universe.updatedAt),
          'Version': universe.version
        }, <Database className="w-5 h-5 text-blue-500" />)}

        {/* Universe Settings */}
        {renderMetadataSection('Settings', {
          'Currency': universe.settings.defaultCurrency,
          'Language': universe.settings.defaultLanguage,
          'Timezone': universe.settings.timezone
        }, <Settings className="w-5 h-5 text-purple-500" />)}

        {/* Family Statistics */}
        {user.adminData && renderMetadataSection('Family Statistics', {
          'Total Members': user.adminData.familyBox.length,
          'Spouses': user.adminData.familyBox.filter(m => m.relationship === 'Spouse').length,
          'Parents': user.adminData.familyBox.filter(m => ['Mother', 'Father'].includes(m.relationship)).length,
          'Children': user.adminData.familyBox.filter(m => ['Son', 'Daughter'].includes(m.relationship)).length,
          'Siblings': user.adminData.familyBox.filter(m => ['Brother', 'Sister'].includes(m.relationship)).length,
          'Total Marriages': user.adminData.familyBox.filter(m => m.marriageData).length / 2, // Divide by 2 as each marriage is counted twice
        }, <Users className="w-5 h-5 text-indigo-500" />)}

        {/* Asset Statistics */}
        {user.adminData && renderMetadataSection('Asset Statistics', {
          'Total Assets': user.adminData.assetBox.length,
          'Companies': user.adminData.assetBox.filter(a => a.type === 'company').length,
          'Personal Assets': user.adminData.assetBox.filter(a => a.type === 'personal').length
        }, <Building2 className="w-5 h-5 text-yellow-500" />)}

        {/* Family Members Detail */}
        {user.adminData && user.adminData.familyBox.length > 0 && (
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Family Members</h3>
            <div className="space-y-4">
              {user.adminData.familyBox.map(renderFamilyMemberSection)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}; 