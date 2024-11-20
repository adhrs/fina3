import React from 'react';
import { ChevronLeft, ChevronRight, Users, Home, Settings, BarChart, UserPlus, Building2, Briefcase } from 'lucide-react';
import { NavItem } from './NavItem';

interface SidebarProps {
  isCollapsed: boolean;
  activeView: string;
  onCollapse: () => void;
  onNavigation: (view: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'family', label: 'Family', icon: UserPlus, path: '/dashboard/family' },
  { id: 'company', label: 'Company', icon: Building2, path: '/dashboard/company' },
  { id: 'assets', label: 'Assets', icon: Briefcase, path: '/dashboard/assets' },
  { id: 'family-tree', label: 'Family Tree', icon: Users, path: '/dashboard/family-tree' },
  { id: 'contacts', label: 'Contacts', icon: Users, path: '/dashboard/contacts' },
  { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/dashboard/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  activeView,
  onCollapse,
  onNavigation,
}) => {
  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h1 className="text-xl font-semibold">Dashboard</h1>}
        <button
          onClick={onCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="p-4">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            isActive={activeView === item.id}
            isCollapsed={isCollapsed}
            onClick={onNavigation}
          />
        ))}
      </nav>
    </div>
  );
};