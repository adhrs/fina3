import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { CompanyList } from './CompanyList';
import { CompanyForm } from './CompanyForm';
import { Company } from '../../types/CompanyTypes';
import { useAuth } from '../../contexts/AuthContext';

export const CompanyView: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Load initial companies from admin data
  useEffect(() => {
    if (user?.adminData?.assetBox) {
      const companyAssets = user.adminData.assetBox
        .filter(asset => asset.type === 'company')
        .map(asset => ({
          id: asset.id,
          name: asset.name || '',
          type: asset.companyType as Company['type'],
          country: asset.country || '',
          status: 'active' as const,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt
        }));
      setCompanies(companyAssets);
    }
  }, [user?.adminData]);

  const handleAddCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    setShowForm(false);
  };

  const handleEditCompany = (company: Company) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
    setShowForm(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Companies</h2>
          <p className="text-sm text-gray-500 mt-1">
            {companies.length} {companies.length === 1 ? 'company' : 'companies'}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCompany(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <CompanyList
        companies={filteredCompanies}
        onEdit={(company) => {
          setSelectedCompany(company);
          setShowForm(true);
        }}
        onDelete={handleDeleteCompany}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <CompanyForm
              company={selectedCompany}
              onSubmit={selectedCompany ? handleEditCompany : handleAddCompany}
              onCancel={() => {
                setShowForm(false);
                setSelectedCompany(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};