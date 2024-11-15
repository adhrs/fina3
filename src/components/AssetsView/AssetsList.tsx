import React from 'react';
import { AssetCard } from './AssetCard';
import { Asset } from '../../types/AssetTypes';

interface AssetsListProps {
  assets: Asset[];
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

export const AssetsList: React.FC<AssetsListProps> = ({ 
  assets, 
  onEdit,
  onDelete 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <AssetCard 
          key={asset.id} 
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {assets.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No assets found</p>
        </div>
      )}
    </div>
  );
};