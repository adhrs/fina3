import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { AssetsList } from './AssetsList';
import { AssetForm } from './AssetForm';
import { Asset } from '../../types/AssetTypes';
import { useAuth } from '../../contexts/AuthContext';

export const AssetView: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Load initial assets from admin data - only personal assets
  useEffect(() => {
    if (user?.adminData?.assetBox) {
      const personalAssets = user.adminData.assetBox
        .filter(asset => asset.type === 'personal')
        .map(asset => ({
          id: asset.id,
          name: asset.realEstateName || asset.otherAssetName || '',
          type: asset.assetType === 'Real estate' ? 'Real Estate' : 'Other',
          value: 0,
          status: 'active' as const,
          description: '',
          location: asset.country,
        }));
      setAssets(personalAssets);
    }
  }, [user?.adminData]);

  const handleAddAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
    setShowForm(false);
  };

  const handleEditAsset = (asset: Asset) => {
    setAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
    setShowForm(false);
    setSelectedAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Assets</h2>
          <p className="text-sm text-gray-500 mt-1">
            {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedAsset(null);
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
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <AssetsList 
        assets={filteredAssets}
        onEdit={(asset) => {
          setSelectedAsset(asset);
          setShowForm(true);
        }}
        onDelete={handleDeleteAsset}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <AssetForm
              asset={selectedAsset}
              onSubmit={selectedAsset ? handleEditAsset : handleAddAsset}
              onCancel={() => {
                setShowForm(false);
                setSelectedAsset(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};