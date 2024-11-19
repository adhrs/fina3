import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';
import { FamilyView } from './FamilyView/FamilyView';
import { CompanyView } from './CompanyView/CompanyView';
import { ContactView } from './ContactView/ContactView';
import { AssetView } from './AssetsView/AssetView';
import { FamilyTreeView } from './FamilyTreeView/FamilyTreeView';
import { AnalyticsView } from './AnalyticsView/AnalyticsView';

export const Dashboard: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the active view from the current path
  const activeView = location.pathname.split('/')[2] || 'home';

  const handleNavigation = (view: string) => {
    navigate(`/dashboard/${view}`);
  };

  // Render the correct content based on the route
  const renderContent = () => {
    switch (activeView) {
      case 'family':
        return <FamilyView />;
      case 'company':
        return <CompanyView />;
      case 'assets':
        return <AssetView />;
      case 'family-tree':
        return <FamilyTreeView />;
      case 'contacts':
        return <ContactView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
      default:
        return <Outlet />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        activeView={activeView}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
        onNavigation={handleNavigation}
      />
      <main className="flex-1 overflow-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
};