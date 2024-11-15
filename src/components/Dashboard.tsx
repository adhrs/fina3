import React, { useState } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { FamilyTreeView } from './FamilyTreeView';
import { FamilyView } from './FamilyView/FamilyView';
import { CompanyView } from './CompanyView/CompanyView';
import { ContactView } from './ContactView/ContactView';
import { AssetView } from './AssetsView/AssetView';
import { DevToolsPanel } from './DevTools/DevToolsPanel';
import { FamilyMember } from '../types/FamilyTypes';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('family');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Only show DevTools in development
  const showDevTools = process.env.NODE_ENV === 'development';

  const renderContent = () => {
    switch(activeView) {
      case 'family':
        return <FamilyView />;
      case 'company':
        return <CompanyView />;
      case 'contacts':
        return <ContactView />;
      case 'assets':
        return <AssetView />;
      case 'family-tree':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <FamilyTreeView data={user?.adminData?.familyBox || []} onMemberClick={setSelectedMember} />
            </div>
            <div>
              {selectedMember && <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h3>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isCollapsed={isCollapsed}
        activeView={activeView}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
        onNavigation={setActiveView}
      />

      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
          </div>
        </header>

        <main className="p-8 h-[calc(100vh-4rem)] overflow-auto">
          {renderContent()}
        </main>

        {showDevTools && user?.adminData && (
          <DevToolsPanel members={user.adminData.familyBox} />
        )}
      </div>
    </div>
  );
};