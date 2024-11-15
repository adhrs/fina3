import React from 'react';
import { Building2 } from 'lucide-react';
import { Company } from '../../types/CompanyTypes';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.type}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <span>{company.location}</span>
        <span className="mx-2">•</span>
        <span>Founded {new Date(company.foundedDate).getFullYear()}</span>
      </div>
    </div>
  );
};