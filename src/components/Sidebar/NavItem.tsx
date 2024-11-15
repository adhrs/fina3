import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: (id: string) => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  id,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center ${
        isCollapsed ? 'justify-center' : 'justify-start'
      } p-3 mb-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium">{label}</span>
      )}
    </button>
  );
};