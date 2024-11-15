import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface BaseCardProps {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    type: 'active' | 'inactive' | 'pending';
  };
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subtitle,
  status,
  icon,
  actions,
  onEdit,
  onDelete,
  children,
}) => {
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
              {status && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status.type)}`}>
                  {status.label}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {actions}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};