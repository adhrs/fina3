import React from 'react';
import { DollarSign, MapPin } from 'lucide-react';
import { Asset } from '../../types/AssetTypes';
import { BaseCard } from '../shared/BaseCard';

interface AssetCardProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  onEdit, 
  onDelete 
}) => {
  const icon = (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-800">
      <DollarSign className="w-6 h-6" />
    </div>
  );

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(asset.value);

  return (
    <BaseCard
      title={asset.name}
      subtitle={asset.type}
      status={{
        label: asset.status,
        type: asset.status
      }}
      icon={icon}
      onEdit={onEdit ? () => onEdit(asset) : undefined}
      onDelete={onDelete ? () => onDelete(asset.id) : undefined}
    >
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-medium text-gray-900">{formattedValue}</span>
        </div>
        
        {asset.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {asset.location}
          </div>
        )}
      </div>
    </BaseCard>
  );
};