import React, { useState } from 'react';
import { AdminData } from '../../types/admin';
import { getGenerationLevel } from '../../utils/generationUtils';
import { determineInheritanceTaxClass } from '../../utils/inheritanceTaxUtils';
import { Settings, Users, Building2, Database, Clock, GitBranch, Shield } from 'lucide-react';
import { initializeTracking } from '../../types/tracking';
import { v4 as uuidv4 } from 'uuid';

interface Step4Props {
  adminData: AdminData;
  onNext: (data: AdminData) => void;
  universeId: string;
}

export const Step4: React.FC<Step4Props> = ({ adminData, onNext, universeId }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinalize = () => {
    setIsProcessing(true);
    
    // Generate IDs and initialize tracking metadata
    const adminId = uuidv4();
    const now = new Date().toISOString();
    const adminTracking = initializeTracking(adminId, 'System');

    // Prepare final admin data with complete metadata
    const finalData: AdminData = {
      ...adminData,
      ...adminTracking,
      universeId,
      role: 'admin',
      status: 'active',
      settings: {
        defaultCurrency: 'EUR',
        defaultLanguage: 'de',
        timezone: 'Europe/Berlin'
      },
      // Enhance family members with complete metadata
      familyBox: adminData.familyBox.map(member => ({
        ...member,
        ...initializeTracking(member.id || uuidv4(), 'System'),
        universeId,
        generationLevel: getGenerationLevel(member.relationship),
        taxClass: determineInheritanceTaxClass(member.relationship, {
          fromPerson: member.id,
          toPerson: adminId
        }),
        relatedTo: adminId
      })),
      // Enhance assets with complete metadata
      assetBox: adminData.assetBox.map(asset => ({
        ...asset,
        ...initializeTracking(asset.id || uuidv4(), 'System'),
        universeId
      }))
    };

    onNext(finalData);
  };

  // Rest of the component remains the same...
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Review Setup Data</h2>
            <p className="mt-2 text-sm text-gray-600">
              Review all information and metadata before finalizing the setup.
            </p>
          </div>

          <div className="space-y-8">
            {/* Universe Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Universe</h3>
              {renderMetadataSection('Universe Metadata', {
                'Universe ID': universeId,
                'Created At': adminData.createdAt,
                'Updated At': adminData.updatedAt,
                'Version': adminData.version,
                'Created By': adminData.createdBy || 'System',
                'Updated By': adminData.updatedBy || 'System'
              }, <Database className="w-5 h-5 text-blue-500" />)}
            </section>

            {/* Admin Information */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin</h3>
              {renderMetadataSection('Basic Information', {
                'Admin ID': adminData.id,
                'Name': `${adminData.firstName} ${adminData.lastName}`,
                'Gender': adminData.gender,
                'Birth': adminData.exactBirthday || adminData.birthYear,
                'Country': adminData.country,
                'Generation Level': adminData.generationLevel
              }, <Shield className="w-5 h-5 text-green-500" />)}

              {renderMetadataSection('Tracking Information', {
                'Created At': formatDate(adminData.createdAt),
                'Updated At': formatDate(adminData.updatedAt),
                'Version': adminData.version,
                'Created By': adminData.createdBy || 'System',
                'Updated By': adminData.updatedBy || 'System'
              }, <Clock className="w-5 h-5 text-orange-500" />)}

              {adminData.settings && renderMetadataSection('Settings', {
                'Currency': adminData.settings.defaultCurrency,
                'Language': adminData.settings.defaultLanguage,
                'Timezone': adminData.settings.timezone
              }, <Settings className="w-5 h-5 text-purple-500" />)}
            </section>

            {/* Family Members */}
            {adminData.familyBox.length > 0 && (
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Family Members</h3>
                <div className="space-y-4">
                  {adminData.familyBox.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
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
                        }, <GitBranch className="w-5 h-5 text-green-500" />)}

                        {renderMetadataSection('Tracking Information', {
                          'Created At': formatDate(member.createdAt),
                          'Updated At': formatDate(member.updatedAt),
                          'Version': member.version,
                          'Created By': member.createdBy || 'System',
                          'Updated By': member.updatedBy || 'System'
                        }, <Clock className="w-5 h-5 text-orange-500" />)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Assets */}
            {adminData.assetBox.length > 0 && (
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assets</h3>
                <div className="space-y-4">
                  {adminData.assetBox.map((asset, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
                        {asset.name || asset.realEstateName || asset.otherAssetName}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {renderMetadataSection('Asset Information', {
                          'Asset ID': asset.id,
                          'Type': asset.type,
                          ...(asset.type === 'company' 
                            ? { 'Company Type': asset.companyType }
                            : { 
                                'Asset Type': asset.assetType,
                                'Real Estate Type': asset.realEstateType,
                                'Real Estate Name': asset.realEstateName,
                                'Other Asset Type': asset.otherAssetType,
                                'Other Asset Name': asset.otherAssetName
                              }
                          ),
                          'Country': asset.country
                        }, <Building2 className="w-5 h-5 text-purple-500" />)}

                        {renderMetadataSection('Tracking Information', {
                          'Created At': formatDate(asset.createdAt),
                          'Updated At': formatDate(asset.updatedAt),
                          'Version': asset.version,
                          'Created By': asset.createdBy || 'System',
                          'Updated By': asset.updatedBy || 'System'
                        }, <Clock className="w-5 h-5 text-orange-500" />)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleFinalize}
                disabled={isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};