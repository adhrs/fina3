/**
 * Step4: Final step of admin setup - Processes family relationships and enriches data
 * 
 * Input Data:
 * - adminData: Basic admin info from previous steps
 * - familyBox: Raw family member data
 * - universeId: Current universe identifier (from UniverseContext)
 * 
 * Universe Integration:
 * - Uses useUniverse() hook to access universe data
 * - Shows universe settings and metadata
 * - Assigns universeId to:
 *   • Admin (baseMember)
 *   • Each family member
 *   • All assets
 * 
 * State Management:
 * - isProcessing: Tracks when data is being processed
 * - processedFamilyBox: Holds enriched family member data
 * - baseMember: Stores admin's own member data with:
 *   • Basic info (name, gender, birth)
 *   • Generation level (0.0)
 *   • Marriage data (if spouse exists)
 *   • Tracking metadata
 * 
 * Processing Flow:
 * 1. Component Mount:
 *    - Initialize baseMember with admin data
 *    - Process family members (useEffect)
 *    - Create marriage data if needed
 * 
 * 2. State Updates:
 *    - processedFamilyBox updated with enriched members
 *    - baseMember updated with marriage data
 *    - isProcessing toggled during finalization
 * 
 * Processing Functions:
 * - getGenerationLevel(): Calculates generation levels (e.g., "0.0" for admin)
 * - determineInheritanceTaxClass(): Assigns tax classes based on relationships
 * - initializeTracking(): Adds metadata (createdAt, updatedAt, version)
 * 
 * Marriage Processing:
 * 1. Spouse Marriage:
 *    - Creates new marriage uuid for admin and spouse
 *    - Adds marriage status, dates, tracking info
 * 2. Parent Marriage:
 *    - Creates shared marriage data for mother and father
 *    - Both parents get the same marriage uuid
 * 
 * Data Enrichment:
 * For each family member, adds:
 * - Generation level
 * - Tax class
 * - Universe ID
 * - Related To (links to admin)
 * - Marriage data (for spouse and parents)
 * - Tracking metadata
 * 
 * Final Output:
 * Processed adminData with:
 * - Enriched family members in familyBox
 * - Processed assets in assetBox
 * - Complete marriage relationships
 * - All required metadata and tracking
 * 
 * Note: This step finalizes all relationships and data
 * before sending to AuthContext for storage
 */

import React, { useState, useEffect } from 'react';
import { AdminData, FamilyMember } from '../../types/admin';
import { getGenerationLevel } from '../../utils/generationUtils';
import { determineInheritanceTaxClass } from '../../utils/inheritanceTaxUtils';
import { Settings, Users, Building2, Database, Clock, GitBranch, Shield, Heart } from 'lucide-react';
import { initializeTracking } from '../../types/tracking';
import { v4 as uuidv4 } from 'uuid';
import { MarriageData } from '../../types/FamilyTypes';
import { useUniverse } from '../../contexts/UniverseContext';

interface Step4Props {
  adminData: AdminData;
  onNext: (data: AdminData) => void;
  universeId: string;
}

export const Step4: React.FC<Step4Props> = ({ adminData, onNext, universeId }) => {
  const { universe } = useUniverse();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFamilyBox, setProcessedFamilyBox] = useState<FamilyMember[]>([]);
  const [baseMember, setBaseMember] = useState(() => {
    const tracking = initializeTracking(adminData.id, 'System');
    return {
      ...tracking,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      relatedTo: null,
      gender: adminData.gender,
      birthYear: adminData.birthYear,
      exactBirthday: adminData.exactBirthday,
      generationLevel: "0.0",
      universeId,
      relationshipDescription: 'Root Member'
    };
  });
  
  // Process family members when component mounts
  useEffect(() => {
    const processedMembers = adminData.familyBox.map(member => {
      const generationLevel = getGenerationLevel(member.relationship);
      const taxClass = determineInheritanceTaxClass(member.relationship, {
        fromPerson: member.id,
        toPerson: adminData.id
      });

      return {
        ...member,
        generationLevel,
        taxClass,
        relatedTo: adminData.id,
        universeId
      };
    });

    // Find mother, father and spouse
    const mother = processedMembers.find(member => member.relationship === 'Mother');
    const father = processedMembers.find(member => member.relationship === 'Father');
    const spouse = processedMembers.find(member => member.relationship === 'Spouse');

    // Create marriage data for parents and spouses
    let spouseMarriageData: MarriageData | undefined;
    let parentMarriageData: MarriageData | undefined;

    // If there's a spouse, create marriage data first
    if (spouse) {
      spouseMarriageData = {
        uuid: crypto.randomUUID(),
        date: null,
        status: 'current',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // If both parents exist, create shared marriage data
    if (mother && father) {
      parentMarriageData = {
        uuid: crypto.randomUUID(),
        date: null,
        status: 'current',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const updatedMembers = processedMembers.map(member => {
      // Handle parent marriage - use the same marriage data for both parents
      if (mother && father && (member.relationship === 'Mother' || member.relationship === 'Father')) {
        return {
          ...member,
          marriageData: parentMarriageData
        };
      }
      // Handle spouse marriage
      if (spouse && member.relationship === 'Spouse' && spouseMarriageData) {
        return {
          ...member,
          marriageData: spouseMarriageData
        };
      }
      return member;
    });

    setProcessedFamilyBox(updatedMembers);

    // Update base member with the same marriage data if there's a spouse
    if (spouseMarriageData) {
      setBaseMember(prev => ({
        ...prev,
        marriageData: spouseMarriageData
      }));
    }
  }, [adminData.familyBox, adminData.id, universeId]);

  const handleFinalize = () => {
    setIsProcessing(true);
    
    const tracking = initializeTracking(adminData.id, 'System');

    const assetBox = adminData.assetBox.map(asset => ({
      ...initializeTracking(asset.id || uuidv4(), adminData.id),
      ...asset,
      universeId
    }));

    const finalData: AdminData = {
      ...tracking,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      gender: adminData.gender,
      birthYear: adminData.birthYear,
      exactBirthday: adminData.exactBirthday,
      country: adminData.country,
      generationLevel: "0.0",
      familyBox: processedFamilyBox, // Use the processed family box
      assetBox,
      universeId,
      role: 'admin',
      status: 'active',
      settings: {
        defaultCurrency: 'EUR',
        defaultLanguage: 'de',
        timezone: 'Europe/Berlin'
      }
    };

    onNext(finalData);
  };

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
          'Relationship': `${adminData.firstName}'s ${member.relationship}`,
          'Gender': member.gender,
          'Birth': member.exactBirthday || member.birthYear
        }, <Users className="w-5 h-5 text-blue-500" />)}

        {renderMetadataSection('Inheritance Information', {
          'Generation Level': member.generationLevel,
          'Tax Class': member.taxClass,
          'Related To': member.relatedTo || 'N/A'
        }, <GitBranch className="w-5 h-5 text-green-500" />)}

        {(member.relationship === 'Spouse' || member.relationship === 'Mother' || member.relationship === 'Father') 
          && member.marriageData && renderMetadataSection('Marriage Information', {
            'Marriage ID': member.marriageData.uuid,
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

              {universe?.settings && renderMetadataSection('Settings', {
                'Currency': universe.settings.defaultCurrency,
                'Language': universe.settings.defaultLanguage,
                'Timezone': universe.settings.timezone
              }, <Settings className="w-5 h-5 text-purple-500" />)}
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin</h3>
              <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Admin Information
                </h2>

                {renderMetadataSection('Base Member Information', {
                  'ID': baseMember.id,
                  'Related To': baseMember.relatedTo || 'None (Root Member)',
                  'Generation Level': baseMember.generationLevel,
                  'Universe ID': baseMember.universeId
                }, <Shield className="w-5 h-5 text-red-500" />)}

                {renderMetadataSection('Basic Information', {
                  'Admin ID': adminData.id,
                  'Name': `${adminData.firstName} ${adminData.lastName}`,
                  'Gender': adminData.gender,
                  'Birth': adminData.exactBirthday || adminData.birthYear,
                  'Country': adminData.country,
                  'Generation Level': adminData.generationLevel,
                  'Role': adminData.role
                }, <Shield className="w-5 h-5 text-green-500" />)}

                {renderMetadataSection('Tracking Information', {
                  'Created At': formatDate(adminData.createdAt),
                  'Updated At': formatDate(adminData.updatedAt),
                  'Version': adminData.version,
                  'Created By': adminData.createdBy || 'System',
                  'Updated By': adminData.updatedBy || 'System'
                }, <Clock className="w-5 h-5 text-orange-500" />)}

                {baseMember.marriageData && renderMetadataSection('Marriage Information', {
                  'Marriage ID': baseMember.marriageData.uuid,
                  'Marriage Date': baseMember.marriageData.date 
                    ? new Date(baseMember.marriageData.date).toLocaleDateString()
                    : 'Not Set',
                  'Status': baseMember.marriageData.status,
                  'Created At': new Date(baseMember.marriageData.createdAt).toLocaleDateString(),
                  'Updated At': new Date(baseMember.marriageData.updatedAt).toLocaleDateString()
                }, <Heart className="w-5 h-5 text-red-500" />)}
              </div>
            </section>

            {processedFamilyBox.length > 0 && (
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Family Members</h3>
                <div className="space-y-4">
                  {processedFamilyBox.map(renderFamilyMemberSection)}
                </div>
              </section>
            )}

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