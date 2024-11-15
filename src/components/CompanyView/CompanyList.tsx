import React from 'react';
import { Building2, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Company } from '../../types/CompanyTypes';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <div
          key={company.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                  {company.status}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Building2 className="w-4 h-4 mr-1" />
                {company.type}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(company)}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Edit company"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(company.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete company"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {company.country}
            </div>
            
            {company.foundedDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Founded: {new Date(company.foundedDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {company.description && (
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
              {company.description}
            </p>
          )}
        </div>
      ))}

      {companies.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No companies found</p>
        </div>
      )}
    </div>
  );
};