import React from 'react';
import { FamilyMember } from '../../types/FamilyTypes';
import { getGenerationLevel } from '../../utils/generationUtils';
import { determineInheritanceTaxClass, TaxClass } from '../../utils/inheritanceTaxUtils';
import { Terminal, ChevronDown, ChevronUp, Clock, Hash, Users, GitBranch, Globe, Shield, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUniverse } from '../../contexts/UniverseContext';

interface DevToolsPanelProps {
  members: FamilyMember[];
}

export const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ members }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();
  const { universe } = useUniverse();

  const getTaxClassName = (taxClass: TaxClass) => {
    switch (taxClass) {
      case TaxClass.I:
        return 'text-green-600';
      case TaxClass.II:
        return 'text-yellow-600';
      case TaxClass.III:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed bottom-0 right-0 w-[600px] bg-white shadow-lg rounded-t-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100"
      >
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span className="font-medium">Developer Tools</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 max-h-[600px] overflow-auto">
          <div className="space-y-6">
            {/* Universe Metadata */}
            {universe && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Universe Metadata
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-gray-500">Universe ID:</span>{' '}
                    <span className="text-blue-600">{universe.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Admin ID:</span>{' '}
                    <span className="text-blue-600">{universe.adminId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>{' '}
                    <span className="text-green-600">{formatDate(universe.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>{' '}
                    <span className="text-orange-600">{formatDate(universe.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Version:</span>{' '}
                    <span className="text-purple-600">{universe.version}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Metadata */}
            {user?.adminData && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin Metadata
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
                  {/* Basic Info */}
                  <div className="pb-2 border-b border-gray-200">
                    <div>
                      <span className="text-gray-500">Admin ID:</span>{' '}
                      <span className="text-blue-600">{user.adminData.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Universe ID:</span>{' '}
                      <span className="text-blue-600">{user.adminData.universeId}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Role:</span>{' '}
                      <span className="text-blue-600">{user.adminData.role || 'admin'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{' '}
                      <span className="text-green-600">{user.adminData.status || 'active'}</span>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  <div className="py-2 border-b border-gray-200">
                    <div>
                      <span className="text-gray-500">Created:</span>{' '}
                      <span className="text-green-600">{formatDate(user.adminData.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>{' '}
                      <span className="text-orange-600">{formatDate(user.adminData.updatedAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Version:</span>{' '}
                      <span className="text-purple-600">{user.adminData.version}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created By:</span>{' '}
                      <span className="text-blue-600">{user.adminData.createdBy || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated By:</span>{' '}
                      <span className="text-blue-600">{user.adminData.updatedBy || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Settings */}
                  {user.adminData.settings && (
                    <div className="pt-2">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Settings className="w-4 h-4 mr-1" />
                        <span className="font-medium">Settings</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Currency:</span>{' '}
                        <span className="text-blue-600">{user.adminData.settings.defaultCurrency}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Language:</span>{' '}
                        <span className="text-blue-600">{user.adminData.settings.defaultLanguage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timezone:</span>{' '}
                        <span className="text-blue-600">{user.adminData.settings.timezone}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Family Members Analysis */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Family Members Analysis
              </h3>
              <div className="space-y-4">
                {members.map(member => {
                  const generationLevel = member.relationship ? getGenerationLevel(member.relationship) : 'N/A';
                  const taxClass = member.relationship ? 
                    determineInheritanceTaxClass(member.relationship, { 
                      fromPerson: member.id, 
                      toPerson: members[0]?.id || '' 
                    }) : 
                    null;

                  return (
                    <div 
                      key={member.id} 
                      className="p-4 bg-gray-50 rounded-lg space-y-3 text-sm"
                    >
                      {/* Basic Info */}
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <span className="text-gray-500">{member.relationship || 'Admin'}</span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* IDs Section */}
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-600">
                            <Hash className="w-4 h-4 mr-1" />
                            <span className="font-medium">IDs</span>
                          </div>
                          <div className="pl-5 space-y-1 font-mono text-xs">
                            <div>
                              <span className="text-gray-500">ID:</span>{' '}
                              <span className="text-blue-600">{member.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Universe:</span>{' '}
                              <span className="text-blue-600">{member.universeId}</span>
                            </div>
                            {member.relatedTo && (
                              <div>
                                <span className="text-gray-500">Related To:</span>{' '}
                                <span className="text-blue-600">{member.relatedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timestamps Section */}
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-medium">Timestamps</span>
                          </div>
                          <div className="pl-5 space-y-1 font-mono text-xs">
                            <div>
                              <span className="text-gray-500">Created:</span>{' '}
                              <span className="text-green-600">{formatDate(member.createdAt)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Updated:</span>{' '}
                              <span className="text-orange-600">{formatDate(member.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Section */}
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="font-medium">Tracking</span>
                          </div>
                          <div className="pl-5 space-y-1 font-mono text-xs">
                            {member.createdBy && (
                              <div>
                                <span className="text-gray-500">Created By:</span>{' '}
                                <span className="text-blue-600">{member.createdBy}</span>
                              </div>
                            )}
                            {member.updatedBy && (
                              <div>
                                <span className="text-gray-500">Updated By:</span>{' '}
                                <span className="text-blue-600">{member.updatedBy}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Version:</span>{' '}
                              <span className="text-purple-600">{member.version || 1}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inheritance Section */}
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-600">
                            <GitBranch className="w-4 h-4 mr-1" />
                            <span className="font-medium">Inheritance</span>
                          </div>
                          <div className="pl-5 space-y-1 font-mono text-xs">
                            <div>
                              <span className="text-gray-500">Generation:</span>{' '}
                              <span className="text-indigo-600">{generationLevel}</span>
                            </div>
                            {taxClass && (
                              <div>
                                <span className="text-gray-500">Tax Class:</span>{' '}
                                <span className={getTaxClassName(taxClass)}>
                                  {TaxClass[taxClass]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};